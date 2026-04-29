import { useOutletContext } from "react-router-dom";
import { Nav, Tab, Row, Col } from "react-bootstrap";
import { BlogOne } from "./BlogOne";
import { BlogTwo } from "./BlogTwo";
import { BlogThree } from "./BlogThree";

/**
 * Blog component displays a collection of blog posts.
 * It uses tabs to navigate between different blog articles.
 *
 * @returns {JSX.Element} The rendered Blog component.
 */
export const Blog = () => {
  const t = useOutletContext();
  const { blog_one, blog_two, blog_three } = t("footer");

  return (
    <>
      <title>Blog</title>
      <main className="main-container">
        <section className="read-more-section">
          <div className="container">
            <div className="read-more-content blog-content-details">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="#how_to_find_quality_customers"
              >
                <Row>
                  <Col lg={3}>
                    <div className="blog-tabs blog-container">
                      <Nav variant="pills" className="flex-column gap-2">
                        <Nav.Item>
                          <Nav.Link href="#how_to_find_quality_customers">
                            {blog_one}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link href="#effective_marketing_strategies_for_home_service_businesses">
                            {blog_two}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link href="#how_can_I_effectively_manage_customer_reviews">
                            {blog_three}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Col>
                  <Col lg={9}>
                    <div className="blog-content blog-container">
                      <Tab.Content>
                        <Tab.Pane eventKey="#how_to_find_quality_customers">
                          <BlogOne />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#effective_marketing_strategies_for_home_service_businesses">
                          <BlogTwo />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#how_can_I_effectively_manage_customer_reviews">
                          <BlogThree />
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
