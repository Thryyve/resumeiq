import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "FREE" && user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left. Please upgrade to Pro." },
        { status: 403 }
      );
    }

    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) and career coach.

Analyze the following resume against the job description and return a JSON response.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no code blocks):
{
  "matchScore": <number between 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ResumeIQ",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", JSON.stringify(aiData, null, 2));
      return NextResponse.json(
        { error: "AI service error. Try again." },
        { status: 500 }
      );
    }

    const text = aiData.choices[0].message.content;

    let feedback;
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      feedback = JSON.parse(cleaned);
    } catch {
      console.error("Parse error. Raw text:", text);
      return NextResponse.json(
        { error: "AI response parsing failed. Try again." },
        { status: 500 }
      );
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        resumeText,
        jobDescription,
        matchScore: feedback.matchScore,
        feedback,
      },
    });

    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });
    }

    return NextResponse.json({ id: analysis.id, matchScore: feedback.matchScore });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}