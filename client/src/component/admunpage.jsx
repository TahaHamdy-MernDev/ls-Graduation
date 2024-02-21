import { Container, Row, Col, Button } from "react-bootstrap";
import BookTable from "./Books/booksTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getBooksSuggestions } from "../Redux/Action/bookAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function AdminPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBooksSuggestions());
  }, [dispatch]);
  const { suggestions } = useSelector((state) => state.book);
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <div className=" book-admin d-flex justify-content-between align-items-center mb-3">
          <h2>{t("manageBooks.title")}</h2>
          <span className="d-flex justify-items-center gap-2">
            {suggestions && suggestions.length > 0 && (
              <Link to="/all-suggestions-books">
                <Button className="btn btn-primary">
                  {t("Suggest.showSuggestions")}
                </Button>
              </Link>
            )}

            <Link to="/create-book">
              <Button className="btn btn-primary">
                {t("addBookForm.addNewBook")}
              </Button>
            </Link>
          </span>
        </div>
      </Row>
      <Row>
        <Col>
          <BookTable />
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
