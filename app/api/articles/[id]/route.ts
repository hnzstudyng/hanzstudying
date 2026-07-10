import { connectDB } from '@/lib/mongodb';
import { Article } from '@/lib/models/Article';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    await connectDB();

    const article = await Article.findById(id).lean();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    await connectDB();

    const data = await req.json();
    const { title, content, description, tags, category, status } = data;

    // Calculate word count
    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    const article = await Article.findByIdAndUpdate(
      id,
      {
        title: title || 'Untitled Article',
        content: content || '',
        description: description || '',
        tags: tags || [],
        category: category || 'General',
        status: status || 'draft',
        wordCount,
        readTime,
      },
      { new: true }
    ).lean();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    await connectDB();

    const article = await Article.findByIdAndDelete(id).lean();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('DELETE /api/articles/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
