"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

interface BlogPost {
  id: number;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch("/api/public/content?section=blog");
        const data = await response.json();

        const foundPost = data.posts.find(
          (p: BlogPost) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        setPost(foundPost || null);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-slate-400 dark:text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            Post not found
          </h1>
          <Link
            href="/"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <PageHeader
        title={post.title}
        breadcrumbs={[{ label: "Blog", href: "/#blog" }, { label: post.title }]}
      />

      <div>
        <div className="max-w-4xl mx-auto px-4 pb-32 mt-12">
          <div className="relative w-auto h-96 rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-contain dark:brightness-90 transition-all"
              priority
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800 transition-colors">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={50}
              height={50}
              className="rounded-full border border-slate-200 dark:border-slate-800"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {post.author.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {post.date} • {post.readTime}
              </p>
            </div>
          </div>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none transition-colors">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 transition-colors">
              This is an exciting article about print design and customization
              trends. Our team of experts shares insights on how to choose the
              right materials and techniques for your printing projects.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 transition-colors">
              Key Takeaways
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 marker:text-purple-500 transition-colors">
              <li>Quality materials make a difference in print longevity</li>
              <li>Personalization increases customer engagement</li>
              <li>Modern printing techniques offer endless possibilities</li>
              <li>Brand consistency is crucial for professional appearance</li>
            </ul>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6 transition-colors">
              Whether you're starting a business or enhancing your brand,
              understanding these principles will help you make informed
              decisions about your printing needs.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
