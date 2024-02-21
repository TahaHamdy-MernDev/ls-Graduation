import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import uploadPdf from "../../images/UploadPdf.png";
import pdf from "../../images/pdf.png";
import uploadImage from "../../images/upload.png";
import { useDispatch, useSelector } from "react-redux";
import { createBookAction } from "../../Redux/Action/bookAction";
import { toast } from "react-toastify";
import { getAllCategoriesAction } from "../../Redux/Action/categoryAction";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Oval } from "react-loader-spinner";

const AddBookSuggestion = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const [coverImage, setCoverImage] = React.useState(null);

    const [bookFile, setBookFile] = useState(null);

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
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { createBookLoading } = useSelector((state) => state.book);
    useEffect(() => {
        dispatch(getAllCategoriesAction());
    }, [dispatch]);
    const navigate = useNavigate()
    const onSubmit = (data) => {
        if (!bookFile) { return toast.error("يرجى اضافة الكتاب") }
        if (!coverImage) { return toast.error("يرجى اضافة صوره الكتاب") }
        data.bookFile = bookFile;
        data.coverImage = coverImage;
        data.Suggestion = true
        dispatch(createBookAction(data))
            .unwrap()
            .then(() => {
                toast.success("your book successfully added")
               reset()
            })
            .catch((error) => {
                toast.error(error.message);
            });

    };

    const { t } = useTranslation();

    return (
        <Container dir={i18n.dir()}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mt-5">
                        <h2 className="title-suggestion">{t('addBookForm.addNewBook')}</h2>
                    <Col lg={6} md={12} className="form-suggestion mb-4">

                        <Form.Group className="mb-2">
                            <Form.Label className="label">{t('addBookForm.bookTitle')}</Form.Label>
                            <Form.Control
                            id="text"
                                type="text"
                                placeholder={t('addBookForm.enterBookTitle')}
                                name="title"
                                {...register("title", { required: true })}
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                            />

                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="label">{t('addBookForm.authorName')}</Form.Label>
                            <Form.Control
                            id="text"
                                type="text"
                                placeholder={t('addBookForm.enterAuthorName')}
                                name="author"
                                {...register("author", { required: true })}
                                className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                            />

                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="label">{t('addBookForm.bookRating')}</Form.Label>
                            <Form.Control
                            id="text"
                                type="number"
                                min="1"
                                max="5"
                                placeholder={t('addBookForm.enterBookRating')}
                                name="author"
                                {...register("rate", { required: true })}
                                className={`form-control ${errors.rate ? 'is-invalid' : ''}`}
                            />

                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label  className="label">{t('addBookForm.bookCategory')}</Form.Label>
                            <Form.Control
                            id="text"
                                as="select"
                                name="category"
                                {...register("category", { required: true })}
                                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                            >
                                <option value="" disabled>
                                    {t('addBookForm.chooseBookCategory')}
                                </option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </Form.Control>

                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="label">{t('addBookForm.bookDescription')}</Form.Label>
                            <Form.Control
                            id="text"
                                as="textarea"
                                rows={4}
                                placeholder={t('addBookForm.enterBookDescription')}
                                name="description"
                                {...register("description", { required: true })}
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            />

                        </Form.Group>
                    </Col>

                    <Col lg={6} md={12}>
                        <Form.Group className="mb-4">
                            <Form.Label  className="label">{t('addBookForm.bookFile')}</Form.Label>

                            <div
                                {...getRootBookFileProps()}
                                className="dropzone border rounded p-3 cursor-pointer"
                            >
                                <input
                                    {...getInputBookFileProps()}
                                    type="file"
                                    accept="application/pdf"

                                />
                                {bookFile ? (
                                    <>
                                    
                                        <Image
                                            src={pdf}
                                            alt="Placeholder PDF"
                                            fluid
                                            className="img-sug mb-3"
                                        />
                                        <p className="text-muted small">{t('addBookForm.bookFileUploadSuccess')}</p>
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src={uploadPdf}
                                            alt="Placeholder PDF"
                                            fluid
                                            className="img-sug mb-3"
                                        />
                                        <p className="text-muted small">{t('addBookForm.bookFilePlaceholder')}</p>
                                    </>
                                )}
                            </div>
                            {errors.bookFile && (
                                <p className="text-danger mt-1">{errors.bookFile.message}</p>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="label">{t('addBookForm.coverImage')}</Form.Label>
                            <div
                                {...getRootCoverImageProps()}
                                className="dropzone border rounded p-3 cursor-pointer"
                            >
                                <input {...getInputCoverImageProps()} />
                                {coverImage ? (
                                    <Image
                                        src={URL.createObjectURL(coverImage)}
                                        alt="Cover Image Preview"
                                        fluid
                                        className="img-sug mb-3"
                                    />
                                ) : (
                                    <Image
                                        src={uploadImage}
                                        alt="Placeholder Image"
                                        fluid
                                        className="img-sug mb-3"
                                    />
                                )}
                                <p className="text-muted small">{t('addBookForm.coverImagePlaceholder')}</p>
                            </div>
                            {errors.coverImage && (
                                <p className="text-danger mt-1">{errors.coverImage.message}</p>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                        {createBookLoading ? (
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
                ):t('addBookForm.addBook')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default AddBookSuggestion