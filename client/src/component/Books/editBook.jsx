import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import uploadPdf from "../../images/UploadPdf.png";
import pdf from "../../images/pdf.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategoriesAction } from "../../Redux/Action/categoryAction";
import { getAllBookAction, updateBookAction } from "../../Redux/Action/bookAction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
function EditBook() {
  const dispatch = useDispatch();
  const { id: bookId } = useParams();
  useEffect(() => {
    dispatch(getAllBookAction());
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
 const bookToEdit = useSelector((state) =>
    state.book.books.find((book) => book._id === bookId)
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
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);
  const coverImageUrl = `${bookToEdit?.coverImage.url}`;
  // const coverImageUrl = `http://localhost:4000/uploads/${bookToEdit?.coverImage}`;


  const onSubmit = (data) => {
    delete data.bookFile;
    if (data.coverImage === null) {
      delete data.coverImage;
    }
     data.coverImage = coverImage;
    dispatch(updateBookAction({ bookId: bookToEdit._id, bookData: data }))
      .unwrap()
      .then(() => {
          toast.success("Book updated successfully");
        navigate("/all-books");
      });
  };
  let bookCategory =
    bookToEdit && bookToEdit.category && bookToEdit.category._id;
  return (
    <Container dir={i18n.dir()}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-5">
          <Col lg={6} md={12} className="mb-4">
          <h2>{t('editBookForm.editBook')}</h2>

            <Form.Group controlId="formTitle" className="mb-2">
            <Form.Label>{t('editBookForm.bookTitle')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('editBookForm.bookTitle')}
                name="title"
                {...register("title", { required: true })}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
             
            </Form.Group>

            <Form.Group controlId="formAuthor" className="mb-2">
            <Form.Label>{t('editBookForm.bookAuthor')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('editBookForm.bookAuthor')}
                name="author"
                {...register("author", { required:true })}
                className={`form-control ${errors.author ? "is-invalid" : ""}`}
              />
             
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-2">
            <Form.Label>{t('editBookForm.bookCategory')}</Form.Label>
              <Form.Control
                as="select"
                name="category"
                {...register("category", {
                  required: "حقل تصنيف الكتاب مطلوب",
                })}
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                // value={bookCategory}
                defaultValue={bookCategory}
              >
                <option value="" disabled>
                {t('editBookForm.chooseCategory')}
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
            <Form.Label>{t('editBookForm.bookDescription')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={t('editBookForm.bookDescription')}
                name="description"
                {...register("description", {
                  required:true,
                })}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
              />
             
            </Form.Group>
          </Col>

          <Col lg={6} md={12}>
            <Form.Group controlId="formBookFile" className="mb-4">
            <Form.Label>{t('editBookForm.uploadBookFile')}</Form.Label>
              {bookToEdit?.file ? (
                <div className="mb-3">
                  <Image
                    src={pdf}
                    alt="Placeholder PDF"
                    fluid
                    className="mb-3"
                  />
                       <p className="text-muted small">{t('addBookForm.bookFileUploadSuccess')}</p>
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
                  />
                  <Image
                    src={uploadPdf}
                    alt="Placeholder PDF"
                    fluid
                    className="mb-3"
                  />
                   <p className="text-muted small">{t('addBookForm.bookFilePlaceholder')}</p>
                </div>
              )}
              {errors.bookFile && (
                <p className="text-danger mt-1">{errors.bookFile.message}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formCoverImage" className="mb-4">
            <Form.Label>{t('editBookForm.uploadBookCover')}</Form.Label>
              <div
                {...getRootCoverImageProps()}
                className="dropzone border rounded p-3 cursor-pointer"
              >
                <input {...getInputCoverImageProps()} />
                {coverImage ? (
                  <>
                    <Image
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
                <p className="text-muted small">{t('addBookForm.coverImagePlaceholder')}</p>
              </div>
              {errors.coverImage && (
                <p className="text-danger mt-1">{errors.coverImage.message}</p>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
            {t('editBookForm.updateBook')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default EditBook;
