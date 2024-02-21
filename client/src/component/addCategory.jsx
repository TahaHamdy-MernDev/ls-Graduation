import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Image,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategoryAction,
  deleteCategoryAction,
  getAllCategoriesAction,
  updateCategoryAction,
} from "../Redux/Action/categoryAction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useDropzone } from "react-dropzone";
// import { addCategoryAction } from "../Redux/Action/categoryAction";
import uploadImage from "../images/upload.png";
import { Oval } from "react-loader-spinner";
function AddCategory() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Form state and methods
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Redux state
  const { categories, updateLoading, createLoading, deleteLoading } =
    useSelector((state) => state.category);
  // Local state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);

  // Handle image drop event
  const onDropCoverImage = (acceptedFiles) => {
    setCategoryImage(acceptedFiles[0]);
  };

  // Dropzone configuration
  const {
    getRootProps: getRootCoverImageProps,
    getInputProps: getInputCoverImageProps,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: "image/*",
  });
  const watchedFields = ["categoryName", "categoryDescription"];
  let data = {};
  watchedFields.forEach((fieldName) => {
    data[fieldName] = watch(fieldName);
  });
  const handleEditCategory = () => {
    if (categoryImage) {
      data = { ...data, image: categoryImage };
    }
    dispatch(
      updateCategoryAction({ id: selectedCategory._id, categoryData: data })
    )
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully!");
        dispatch(getAllCategoriesAction());
      });
    // reset();
  };

  // Handle category delete
  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategoryAction(categoryId))
      .unwrap()
      .then(() => {
        toast.success(t("addCategory.deletedCategoryMsg"));
        setSelectedCategory(null);
        dispatch(getAllCategoriesAction());
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setValue("categoryName", category.categoryName);
    setValue("categoryDescription", category.categoryDescription);
    // setCategoryImage(category.categoryImage.url);
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!categoryImage) {
      return toast.error("يرجى اضافة صوره");
    }

    data = { ...data, image: categoryImage };

    dispatch(createCategoryAction(data))
      .unwrap()
      .then(() => {
        toast.success(t("addCategory.addedCategoryMsg"));
        setCategoryImage(null);
        reset();
        dispatch(getAllCategoriesAction());
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Container
      dir={i18n.dir()}
      fluid
      style={{ minHeight: "calc(100vh - 56px - 56px)" }}
    >
      <Row className="mt-5">
        <Col lg={3} md={12} className="mb-4">
          <ListGroup>
            {categories?.map((category) => (
              <ListGroup.Item
                onClick={() => handleCategoryClick(category)}
                key={category._id}
                className="cat-list"
                style={{ cursor: "pointer" }}
                active={
                  selectedCategory && selectedCategory._id === category._id
                }
              >
                <span>{category.categoryName}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col lg={9} md={12} className="mb-4">
          <div className="add-category">
            {selectedCategory ? (
              <h2 className="category-title">
                {t("addCategory.editCategory")}{" "}
              </h2>
            ) : (
              <h2>{t("addCategory.addNewCategory")}</h2>
            )}

            <Form autoComplete="true" onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="categoryName" className="label mb-1">
                  {t("addCategory.categoryName")}
                </Form.Label>
                <Form.Control
                  type="text"
                  id="categoryName"
                  placeholder={t("addCategory.categoryName")}
                  name="categoryName"
                  {...register("categoryName", {
                    required: t("addCategory.categoryNameRequired"),
                  })}
                  className={`form-control ${
                    errors.categoryName ? "is-invalid" : ""
                  }`}
                />
                {errors.categoryName && (
                  <div className="invalid-feedback">
                    {errors.categoryName.message}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label
                  htmlFor="categoryDescription"
                  className="label mb-1"
                >
                  {t("addCategory.categoryDescription")}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="categoryDescription"
                  rows={4}
                  placeholder={t("addCategory.categoryDescription")}
                  name="categoryDescription"
                  {...register("categoryDescription", {
                    required: t("addCategory.categoryDescriptionRequired"),
                  })}
                  className={`form-control ${
                    errors.categoryDescription ? "is-invalid" : ""
                  }`}
                />
                {errors.categoryDescription && (
                  <div className="invalid-feedback">
                    {errors.categoryDescription.message}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="categoryImage" className="label">
                  {t("addCategory.categoryImage")}
                </Form.Label>
                <div
                  {...getRootCoverImageProps()}
                  className="dropzone border rounded p-3 cursor-pointer"
                >
                  <input {...getInputCoverImageProps()} id="categoryImage" />
                  {categoryImage ? (
                    <Image
                      src={URL.createObjectURL(categoryImage)}
                      alt="Cover Image Preview"
                      fluid
                      className="mb-3"
                    />
                  ) : (
                    <Image
                      src={
                        selectedCategory
                          ? selectedCategory.categoryImage.url
                          : uploadImage
                      }
                      alt="Placeholder Image"
                      fluid
                      className="cat-img mb-3"
                    />
                  )}
                  <p className="text-muted small">
                    {t("addCourse.dropzoneText")}
                  </p>
                </div>
                {errors.coverImage && (
                  <p className="text-danger mt-1">
                    {errors.coverImage.message}
                  </p>
                )}
              </Form.Group>
              {selectedCategory ? (
                <div className=" d-flex justify-items-center gap-2">
                  <Button
                    disabled={updateLoading}
                    variant="primary"
                    type="button"
                    onClick={() => handleEditCategory()}
                    className="mb-3"
                  >
                    {updateLoading ? (
                      <Oval
                        strokeColor="white"
                        strokeWidth="5"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        animationDuration="0.75"
                        width="40"
                        height="30"
                        visible={true}
                      />
                    ) : (
                      t("addCategory.editCategory")
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    className="mb-3"
                    disabled={deleteLoading}
                    onClick={() => handleDeleteCategory(selectedCategory._id)}
                  >
                    {deleteLoading ? (
                      <Oval
                        strokeColor="white"
                        strokeWidth="5"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        animationDuration="0.75"
                        width="40"
                        height="30"
                        visible={true}
                      />
                    ) : (
                      t("addCategory.deleteCategoryBtn")
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  disabled={createLoading}
                  variant="primary"
                  type="submit"
                  className="mb-3"
                >
                  {createLoading ? (
                    <Oval
                      strokeColor="white"
                      strokeWidth="5"
                      color="#4fa94d"
                      ariaLabel="oval-loading"
                      animationDuration="0.75"
                      width="40"
                      height="30"
                      visible={true}
                    />
                  ) : (
                    t("addCategory.addNewCategory")
                  )}
                </Button>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AddCategory;
