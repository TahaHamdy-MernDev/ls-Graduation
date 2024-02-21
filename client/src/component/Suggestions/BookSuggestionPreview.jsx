import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import uploadPdf from "../../images/UploadPdf.png";
import pdf from "../../images/pdf.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategoriesAction } from "../../Redux/Action/categoryAction";
import {
  acceptBookSuggestionAction,
  deleteBookAction,
  getBooksSuggestions,
  updateBookAction,
} from "../../Redux/Action/bookAction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Oval } from "react-loader-spinner";
const BookSuggestionPreview = () => {
  const dispatch = useDispatch();
  const { id: bookId } = useParams();
  useEffect(() => {
    dispatch(getBooksSuggestions());
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const bookToEdit = useSelector((state) =>
    state.book.suggestions.find((book) => book._id === bookId)
  );

  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);

  const { t } = useTranslation();
  useEffect(() => {
    if (bookToEdit) {
      setValue("title", bookToEdit.title);
      setValue("author", bookToEdit.author);
      setValue("description", bookToEdit.description);
      setValue("category", bookToEdit?.category._id);
    }
  }, [bookToEdit, setValue]);

  const onDropBookFile = (acceptedFiles) => {
    setBookFile(acceptedFiles[0]);
  };

  const {
    getRootProps: getRootBookFileProps,
    getInputProps: getInputBookFileProps,
  } = useDropzone({
    onDrop: onDropBookFile,
    accept: ".pdf",
  });

  const onDropCoverImage = (acceptedFiles) => {
    setCoverImage(acceptedFiles[0]);
  };

  const {
    getRootProps: getRootCoverImageProps,
    getInputProps: getInputCoverImageProps,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: "image/*",
  });
  const { categories } = useSelector((state) => state.category);
  const { acceptBookSuggestionLoading, deleteBookLoading } = useSelector(
    (state) => state.book
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);
  const coverImageUrl = `${bookToEdit?.coverImage.url}`;
  const handleDeleteBook = (bookToDelete) => {
    dispatch(deleteBookAction(bookToDelete))
      .unwrap()
      .then(() => {
        toast.success("Book Deleted Successfully");
        navigate("/all-suggestions-books");
      })
      .then((err) => {
        toast.error(err.message);
      });
  };
  const onSubmit = () => {
    dispatch(acceptBookSuggestionAction({ _id: bookToEdit._id }))
      .unwrap()
      .then(() => {
        toast.success("book successfully accepted");
        navigate("/all-suggestions-books");
      });
  };

  let bookCategory =
    bookToEdit && bookToEdit.category && bookToEdit.category._id;
  return (
    <Container dir={i18n.dir()}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-5">
          <Col lg={6} md={12} className="mb-4">
            <h2>{t("editBookForm.editBook")}</h2>

            <Form.Group controlId="formTitle" className="mb-2">
              <Form.Label>{t("editBookForm.bookTitle")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("editBookForm.bookTitle")}
                name="title"
                disabled
                {...register("title", { required: true })}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
            </Form.Group>

            <Form.Group controlId="formAuthor" className="mb-2">
              <Form.Label>{t("editBookForm.bookAuthor")}</Form.Label>
              <Form.Control
                type="text"
                disabled
                placeholder={t("editBookForm.bookAuthor")}
                name="author"
                {...register("author", { required: true })}
                className={`form-control ${errors.author ? "is-invalid" : ""}`}
              />
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-2">
              <Form.Label>{t("editBookForm.bookCategory")}</Form.Label>
              <Form.Control
                readOnly
                disabled
                as="select"
                name="category"
                {...register("category", {
                  required: "حقل تصنيف الكتاب مطلوب",
                })}
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                defaultValue={bookCategory}
              >
                <option value="" disabled>
                  {t("editBookForm.chooseCategory")}
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
              {errors.category && (
                <p className="text-danger">{errors.category.message}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-2">
              <Form.Label>{t("editBookForm.bookDescription")}</Form.Label>
              <Form.Control
                disabled
                as="textarea"
                rows={4}
                placeholder={t("editBookForm.bookDescription")}
                name="description"
                {...register("description", {
                  required: true,
                })}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
              />
            </Form.Group>
          </Col>

          <Col lg={6} md={12}>
            <Form.Group controlId="formBookFile" className="mb-4">
              {bookToEdit?.file ? (
                <div className="mb-3">
                  <Image
                    src={pdf}
                    alt="Placeholder PDF"
                    fluid
                    className="mb-3"
                  />
                  <p className="text-muted small">
                    {t("addBookForm.bookFileUploadSuccess")}
                  </p>
                </div>
              ) : (
                <div
                  {...getRootBookFileProps()}
                  className="dropzone border rounded p-3 cursor-pointer"
                >
                  <input
                    {...getInputBookFileProps()}
                    type="file"
                    accept="application/pdf"
                    disabled
                  />
                  <Image
                    src={uploadPdf}
                    alt="Placeholder PDF"
                    fluid
                    className="mb-3"
                  />
                  <p className="text-muted small">
                    {t("addBookForm.bookFilePlaceholder")}
                  </p>
                </div>
              )}
              {errors.bookFile && (
                <p className="text-danger mt-1">{errors.bookFile.message}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formCoverImage" className="mb-4">
              <div
                {...getRootCoverImageProps()}
                className="dropzone border rounded p-3 cursor-pointer"
                aria-disabled
                disabled
                onClick={() => {
                  return 0;
                }}
              >
                <input {...getInputCoverImageProps()} disabled />
                {coverImage ? (
                  <>
                    <Image
                      readOnly
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover Image Preview"
                      fluid
                      className="mb-3"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src={coverImageUrl}
                      alt="Cover Image"
                      fluid
                      className="mb-3"
                    />
                  </>
                )}
              </div>
              {errors.coverImage && (
                <p className="text-danger mt-1">{errors.coverImage.message}</p>
              )}
            </Form.Group>
            <span className="d-flex gap-3">
              <Button
                disabled={acceptBookSuggestionLoading}
                variant="primary"
                type="submit"
              >
                {acceptBookSuggestionLoading ? (
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
                  t("Suggest.accept")
                )}
              </Button>
              <Button
                disabled={acceptBookSuggestionLoading}
                variant="danger"
                onClick={() => handleDeleteBook(bookToEdit?._id)}
                type="button"
              >
                {deleteBookLoading ? (
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
                  t("Suggest.reject")
                )}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default BookSuggestionPreview;
