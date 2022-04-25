import { LOAD_LIST_BLOG, CREATE_BLOG, EDIT_BLOG, DELETE_BLOG } from 'constants/blog';

function loadListBlog(payload) {
  return {
    type: LOAD_LIST_BLOG,
    payload,
  };
}

function createBlog(payload) {
  return {
    type: CREATE_BLOG,
    payload,
  };
}

function editBlog(payload) {
  return {
    type: EDIT_BLOG,
    payload,
  };
}

function deleteBlog(payload) {
  return {
    type: DELETE_BLOG,
    payload,
  };
}

const blogActions = {
  loadListBlog,
  createBlog,
  editBlog,
  deleteBlog,
};

export default blogActions;
