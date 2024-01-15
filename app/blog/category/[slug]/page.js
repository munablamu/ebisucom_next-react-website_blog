import { getAllCategories, getAllPostsByCategory } from 'lib/api';
// import Meta from 'components/meta';
import { getImageBuffer } from 'lib/getImageBuffer';
import Container from 'components/container';
import PostHeader from 'components/post-header';
import Posts from 'components/posts';
import { getPlaiceholder } from 'plaiceholder';
import { eyecatchLocal } from 'lib/constants';

export default async function Category({ params }) {
  const catSlug = params.slug;

  const allCats = await getAllCategories();
  const cat = allCats.find(({ slug }) => slug === catSlug);
  const name = cat.name;

  const posts = await getAllPostsByCategory(cat.id);

  for (const post of posts) {
    if (!post.hasOwnProperty('eyecatch')) {
      post.eyecatch = eyecatchLocal;
    }
    const imageBuffer = await getImageBuffer(post.eyecatch.url);
    const { base64 } = await getPlaiceholder(imageBuffer);
    post.eyecatch.blurDataURL = base64;
  }

  return (
    <Container>
      {/* <Meta pageTitle={name} pageDesc={`${name}に関する記事`} /> */}
      <PostHeader title={name} subtitle="Blog Category" />
      <Posts posts={posts} />
    </Container>
  );
}

export const dynamicParams = false;
export async function generateStaticParams() {
  const allCats = await getAllCategories();
  return allCats.map(({ slug }) => {
    return { slug: slug };
  });
}
