import { getPostBySlug, getAllSlugs } from 'lib/api';
import { extractText } from 'lib/extract-text';
import { prevNextPost } from 'lib/prev-next-post';
// import Meta from 'components/meta';
import Container from 'components/container';
import PostHeader from 'components/post-header';
import PostBody from 'components/post-body';
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from 'components/two-column';
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';
import { getImageBuffer } from 'lib/getImageBuffer';
import { eyecatchLocal } from 'lib/constants';
import ConvertBody from 'components/convert-body';
import PostCategories from 'components/post-categories';
import Pagination from 'components/pagination';

export default async function Post({ params }) {
  const slug = params.slug;

  const post = await getPostBySlug(slug);

  const { title, publishDate: publish, content, categories } = post;

  const description = extractText(content);

  const eyecatch = post.eyecatch ?? eyecatchLocal;

  const imageBuffer = await getImageBuffer(eyecatch.url);
  const { base64 } = await getPlaiceholder(imageBuffer);
  eyecatch.blurDataURL = base64;

  const allSlugs = await getAllSlugs();
  const [prevPost, nextPost] = prevNextPost(allSlugs, slug);

  return (
    <Container>
      {/* <Meta
        pageTitle={title}
        pageDesc={description}
        pageImg={eyecatch.url}
        pageImgW={eyecatch.width}
        pageImgH={eyecatch.height}
  /> */}

      <article>
        <PostHeader title={title} subtitle="Blog Article" publish={publish} />

        <figure>
          <Image
            key={eyecatch.url}
            src={eyecatch.url}
            alt=""
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            width={eyecatch.width}
            height={eyecatch.height}
            sizes="{min-width: 1152px) 1152px, 100vw"
            priority
            placeholder="blur"
            blurDataURL={eyecatch.blurDataURL}
          />
        </figure>

        <TwoColumn>
          <TwoColumnMain>
            <PostBody>
              <ConvertBody contentHTML={content} />
            </PostBody>
          </TwoColumnMain>
          <TwoColumnSidebar>
            <PostCategories categories={categories} />
          </TwoColumnSidebar>
        </TwoColumn>

        <Pagination
          prevText={prevPost.title}
          prevUrl={`/blog/${prevPost.slug}`}
          nextText={nextPost.title}
          nextUrl={`/blog/${nextPost.slug}`}
        />
      </article>
    </Container>
  );
}

export const dynamicParams = false;
export async function generateStaticParams() {
  const allSlugs = await getAllSlugs();

  return allSlugs.map(({ slug }) => {
    return { slug: slug };
  });
}
