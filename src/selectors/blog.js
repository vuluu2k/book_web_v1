import { createSelector } from 'reselect';

const selectBlogDomain = () => state => state.blog;

const selectBlogData = createSelector(selectBlogDomain(), substate => substate.blogData);

const selectBlog = createSelector(
  selectBlogData,

  selectBlogData => ({
    selectBlogData,
  })
);

export { selectBlogData };

export default selectBlog;
