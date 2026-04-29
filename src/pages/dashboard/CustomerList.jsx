import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { DeleteCustomerModal } from "../../components/UI/DeleteCustomerModal";
import { AddReviewModal } from "../../components/UI/AddReviewModal";
import { CustomerModal } from "../../components/UI/CustomerModel";
import { BulkUploadModal } from "../../components/UI/BulkUploadModal";
import { ReviewStarRating } from "./reviewStarRating";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchCustomers } from "../../services/customer";
import { BeatLoader } from "react-spinners";
import { SUCCESS } from "../../config/constant";

/**
 * CustomerList component displays a list of customers associated with a business.
 * It allows users to add, edit, delete, and review customers, as well as upload customer data in bulk.
 *
 * @returns {JSX.Element} The rendered customer list component.
 */
export const CustomerList = () => {
  const { collapse, t } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [showCustomerDeleteModal, setShowCustomerDeleteModal] = useState(false);
  const [business_id, setBusinessId] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [customerIdToEdit, setCustomerIdToEdit] = useState(null);
  const [addReviewCustomerId, setAddReviewCustomerId] = useState(null);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const usersData = useSelector((state) => state.user);

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setBusinessId(users.business_details[0]?._id);
    }
  }, [usersData]);

  useEffect(() => {
    if (business_id) fetchCustomerList(business_id);
  }, [business_id]);

  const fetchCustomerList = async (business_id) => {
    setLoading(true);
    const payload = { business_id };
    if (business_id) {
      const response = await fetchCustomers(payload);
      const customerDataList = response.data;
      setCustomerData(customerDataList);
    }
    setLoading(false);
  };

  const filteredCustomerData = customerData?.filter((customer) => {
    const fullName = `${customer.first_name || ""} ${
      customer.last_name || ""
    }`.toLowerCase();
    return fullName.includes(globalFilter.toLowerCase());
  });

  const openCustomerModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    fetchCustomerList(business_id);
    setCustomerIdToEdit(null);
    setShowModal(false);
  };

  const openEditCustomerModal = (customerId) => {
    setCustomerIdToEdit(customerId);
    setShowModal(true);
  };

  const viewCustomerProfile = (customerId) => {
    navigate("/app/customer-profile/" + customerId);
  };

  const openDeleteModal = (customerId) => {
    setCustomerIdToDelete(customerId);
    setShowCustomerDeleteModal(true);
  };

  const closeDeleteCustomerModal = () => {
    fetchCustomerList(business_id);
    setShowCustomerDeleteModal(false);
  };

  const openModal = (customerId) => {
    setModalOpen(true);
    setAddReviewCustomerId(customerId);
  };

  const closeReviewModal = () => {
    fetchCustomerList(business_id);
    setModalOpen(false);
  };

  const openBulkUploadModal = () => {
    setBulkUploadModalOpen(true);
  };

  const closeBulkUploadModal = () => {
    fetchCustomerList(business_id);
    setBulkUploadModalOpen(false);
  };

  const { heading, addCustomer, csv_template, csv_upload } =
    t("customerComponent");
  const csvTemplate = "/assets/sampleUserCsv.csv";
  return (
    <>
      <section className={`dashboard left-spacing ${collapse ? "expand" : ""}`}>
        <div className="customer-list d-flex flex-wrap align-items-center">
          <h1 className="mb-0 global-heading">{heading}</h1>
          <div className="customer-btns d-flex flex-wrap gap-sm-3 ms-auto">
            <a
              href={csvTemplate}
              target="_blank"
              className="button"
              download="sampleUserCsv.csv"
            >
              {csv_template}
            </a>
            <button
              type="button"
              title={csv_upload}
              className="button"
              onClick={openBulkUploadModal}
            >
              {csv_upload}
            </button>
            <button
              type="button"
              title={addCustomer}
              className="button"
              onClick={openCustomerModal}
            >
              {addCustomer}
            </button>
          </div>
        </div>
        <div className="global-search mb-3">
          <input
            type="text"
            placeholder={t("userComponent.search_list")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="form-control"
          />
        </div>
        {loading ? (
          <>
            <div className="spinner-loder">
              <span>
                {" "}
                <BeatLoader />
              </span>
            </div>
          </>
        ) : (
          <>
            <DataTable
              value={filteredCustomerData}
              paginator
              rows={10}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              emptyMessage={
                <div className="empty-message">
                  {t("customerName.no_customer")}
                </div>
              }
              scrollable
              scrollHeight="400px"
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              sortMode="multiple"
              currentPageReportTemplate={t(
                "customerName.currentPageReportTemplate"
              )}
              rowClassName={(rowData) =>
                rowData.owner_type === "rental" ? "pending-row" : ""
              }
              className="customer-datatable"
              tableStyle={{ borderWidth: "0px" }}
            >
              <Column
                header={t("customerName.customer_name")}
                body={(rowData) => `${rowData.first_name} ${rowData.last_name}`}
              />
              <Column
                header={t("customerName.review")}
                field="review"
                body={(rowData) => (
                  <div className="add-review-cell">
                    {rowData.averageRating > 0 &&
                      rowData.status === "active" && (
                        <ReviewStarRating
                          size={17}
                          mode={true}
                          averageRating={rowData.averageRating}
                        />
                      )}
                    {rowData.averageRating <= 0 &&
                      (rowData.status === "active" ||
                        rowData.status === "pending") && (
                        <Link
                          to="#"
                          title="Add Review"
                          onClick={() => openModal(rowData._id)}
                          style={{
                            color: rowData.status === "active" ? "" : "#AEAEAE",
                            pointerEvents:
                              rowData.status === "active" ? "auto" : "none",
                          }}
                        >
                          {t("reviewRating.heading")} <span></span>
                        </Link>
                      )}
                  </div>
                )}
              />
              <Column
                header={t("customerName.status")}
                field="status"
                body={(rowData) => (
                  <div className="add-review-cell">
                    {rowData.verified_by === "attom" && (
                      <p>{t("customerName.homeowner_verified")}</p>
                    )}
                    {rowData.verified_by === "business" && (
                      <p>{t("customerName.address_verified")}</p>
                    )}
                    {rowData.verified_by === "unverified" && (
                      <p>{t("customerSearch.unverified")}</p>
                    )}
                    {rowData.verified_by === null && (
                      <p>{t("customerSearch.unverified")}</p>
                    )}
                  </div>
                )}
              />
              <Column
                header={t("customerName.action")}
                body={(rowData) => (
                  <div className="action-cell">
                    <span>
                      <a
                        title={t("customerName.view")}
                        onClick={() => viewCustomerProfile(rowData._id)}
                      >
                        <i className="pi pi-eye customer-Eye" />
                      </a>
                      <a
                        title={t("customerName.edit")}
                        onClick={() => openEditCustomerModal(rowData._id)}
                      >
                        <i className="pi pi-pen-to-square customer-Eye" />
                      </a>
                      <a
                        title={t("customerName.Delete")}
                        onClick={
                          rowData.status === "pending"
                            ? () => openDeleteModal(rowData._id)
                            : null
                        }
                        style={{
                          color:
                            rowData.status === "pending" ? "red" : "#AEAEAE",
                          pointerEvents:
                            rowData.status === "pending" ? "auto" : "none",
                        }}
                      >
                        <i className="pi pi-trash" />
                      </a>
                    </span>
                  </div>
                )}
              />
            </DataTable>
          </>
        )}

        <CustomerModal
          show={showModal}
          onRequestClose={closeModal}
          customerId={customerIdToEdit}
          business_id={business_id}
          setEditCutomerId={setCustomerIdToEdit}
        />

        <BulkUploadModal
          isOpen={bulkUploadModalOpen}
          onRequestClose={closeBulkUploadModal}
          businessId={business_id}
        />

        <AddReviewModal
          isOpen={isModalOpen}
          onRequestClose={closeReviewModal}
          customerData={addReviewCustomerId}
          businessData={business_id}
        />

        <DeleteCustomerModal
          show={showCustomerDeleteModal}
          onRequestClose={closeDeleteCustomerModal}
          customerId={customerIdToDelete}
          business_id={business_id}
        />
      </section>
    </>
  );
};
