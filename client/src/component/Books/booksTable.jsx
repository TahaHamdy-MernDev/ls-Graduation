import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBookAction,
  getAllBookAction,
} from "../../Redux/Action/bookAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Oval } from "react-loader-spinner";

function BookTable() {
  const dispatch = useDispatch();
  const { books, deleteBookLoading } = useSelector((state) => state.book);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllBookAction());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleEdit = (bookId) => {
    navigate(`/edit-book/${bookId}`);
  };

  const handleShowModal = (bookId) => {
    setBookToDelete(bookId);
    setShowConfirmModal(true);
  };

  const handleHideModal = () => {
    setShowConfirmModal(false);
    setBookToDelete(null);
  };
  const { t } = useTranslation();
  const handleDeleteBook = () => {
    if (bookToDelete) {
      dispatch(deleteBookAction(bookToDelete))
        .unwrap()
        .then(() => {
          let msg = t("bookTable.bookDeletedSuccessfully");
          toast.success(`${msg}`);
          setBookToDelete(null);
          setShowConfirmModal(false);
          dispatch(getAllBookAction());
        })
        .then((err) => {
          toast.error(err.message);
        });
    }
  };
  const formatLastUpdate = (updatedAt) => {
    const date = new Date(updatedAt);

    // Format date
    const optionsDate = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("ar-EG", optionsDate).format(
      date
    );

    // Format time
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("ar-EG", optionsTime).format(
      date
    );

    return `يوم ${formattedDate} الساعة ${formattedTime}`;
  };
  const formattedBooks = books?.map((book) => ({
    ...book,
    title: book.title.split(" ").slice(0, 4).join(" "),
    formattedUpdatedAt: formatLastUpdate(book.updatedAt),
  }));
  const actionBodyTemplate = (book) => {
    return (
      <span className="d-flex justify-content-center align-items-center gap-2 p-4">
        <Button
          onClick={() => handleEdit(book._id)}
          variant="info"
          size="md"
          className="pr-2"
        >
          {t("bookTable.edit")}
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => handleShowModal(book._id)}
        >
          {t("bookTable.delete")}
        </Button>
      </span>
    );
  };
  return (
    <div
      className="card p-fluid"
      style={{ borderRadius: "15px", backgroundColor: "#fff" }}
    >
      <DataTable
        value={formattedBooks}
        dataKey="_id"
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
        rowHover
        style={{ fontSize: "18px", padding: "10px" }}
        sortField="createdAt"
        sortOrder={-1}
        paginator
        rows={10}
      >
        <Column
          headerStyle={{ padding: "1rem" }}
          style={{ width: "25%", textAlign: "right" }}
          field="title"
          header={t("bookTable.bookTitle")}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="author"
          header={t("bookTable.authorName")}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="category.categoryName"
          header={t("bookTable.bookCategory")}
        ></Column>
        <Column
          style={{ width: "25%", textAlign: "right" }}
          field="formattedUpdatedAt"
          header={t("bookTable.lastUpdateOn")}
          sortable
        ></Column>

        <Column
          style={{ width: "25%", textAlign: "right" }}
          header={t("bookTable.actions")}
          body={actionBodyTemplate}
          headerStyle={{ textAlign: "center", minWidth: "8rem" }}
        />
      </DataTable>
      <Modal centered show={showConfirmModal} onHide={handleHideModal}>
        <Modal.Header>
          <Modal.Title>{t("bookTable.confirmDeletion")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("bookTable.confirmDeletionMessage")}</Modal.Body>
        <Modal.Footer className="justify-content-start">
          <Button
            disabled={deleteBookLoading}
            variant="danger"
            onClick={handleDeleteBook}
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
              t("bookTable.delete")
            )}
          </Button>
          <Button
            disabled={deleteBookLoading}
            variant="secondary"
            onClick={handleHideModal}
          >
            {t("bookTable.cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookTable;
