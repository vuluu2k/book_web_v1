import { LOAD_LIST_CATEGORY, CREATE_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY } from 'constants/category';

function loadListCategory(payload) {
  return {
    type: LOAD_LIST_CATEGORY,
    payload,
  };
}

function createCategory(payload) {
  return {
    type: CREATE_CATEGORY,
    payload,
  };
}

function editCategory(payload) {
  return {
    type: EDIT_CATEGORY,
    payload,
  };
}

function deleteCategory(payload) {
  return {
    type: DELETE_CATEGORY,
    payload,
  };
}

const categoryActions = {
  loadListCategory,
  createCategory,
  editCategory,
  deleteCategory,
};

export default categoryActions;
