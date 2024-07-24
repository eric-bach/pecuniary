import { fetchCategories } from '@/actions/fetch-cateogies';
import Categories from '@/features/categories';

const CategoriesPage = async () => {
  const categories = await fetchCategories();

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Categories categories={categories} />
    </div>
  );
};

export default CategoriesPage;
