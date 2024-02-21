import { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
 getBooksSuggestions,
} from "../../Redux/Action/bookAction";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
export const BookSuggestionList = () => {
  const dispatch = useDispatch();
  const {suggestions: books } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(getBooksSuggestions());
  }, [dispatch]);

  const navigate = useNavigate();

  const handlePreview = (bookId) => {
    navigate(`/preview-book/${bookId}`);
  };

  const { t } = useTranslation();
 
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
          onClick={() => handlePreview(book._id)}
          variant="info"
          size="md"
          className="pr-2"
        >
          {t("Suggest.show")}
        </Button>
      </span>
    );
  };
  return (
    <Container className="mt-4">
        <Row>
        <h2 dir={i18n.dir()}>{t('Suggest.ManageSuggestedBooks')}</h2>
     <Col> 
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
    </div>
  
     </Col>   
    </Row>   
    </Container>
 
    
  
  
  );
};
