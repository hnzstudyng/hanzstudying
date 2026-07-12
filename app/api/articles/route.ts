import { connectDB } from '@/lib/mongodb';
import { Article } from '@/lib/models/Article';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
    } catch (dbError) {
      return NextResponse.json({
        error: 'Database connection failed. Please check your MONGODB_URI environment variable.'
      }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const sort = searchParams.get('sort') || '-updatedAt';

    const filter: any = { status };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      filter.tags = tag;
    }

    if (category) {
      filter.category = category;
    }

    const articles = await Article.find(filter).sort(sort).lean();

    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();
    const { title, content, description, tags, category, status } = data;

    // Calculate word count
    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    const article = new Article({
      title: title || 'Untitled Article',
      content: content || '',
      description: description || '',
      tags: tags || [],
      category: category || 'General',
      status: status || 'draft',
      wordCount,
      readTime,
    });

    await article.save();

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
