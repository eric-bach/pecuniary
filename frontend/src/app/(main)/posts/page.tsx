import BackButton from '@/components/back-button';
import PostsPagination from '@/components/posts/posts-pagination';
import PostsTable from '@/components/posts/posts-table';

const Posts = () => {
  return (
    <>
      <BackButton text='Go Back' link='/' />
      <PostsTable />
      <PostsPagination />
    </>
  );
};

export default Posts;
