import { useNavigate, useOutletContext } from "react-router-dom";
import { DeleteUserModal } from "../../components/UI/DeleteUserModal";
import { AddUserModal } from "../../components/UI/AddUserModal";
import { MoreUserModal } from "../../components/UI/MoreUserModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect } from "react";
import { getUserDetails } from "../../services/user";
import { getUserList } from "../../services/additionalUser";
import { BeatLoader } from "react-spinners";

/**
 * AdditionalUsers component manages the display and management of additional users for a business.
 * It allows users to add, view, and delete additional users based on the active subscription plan.
 *
 * @returns {JSX.Element} The rendered additional users management component.
 */
export const AdditionalUsers = () => {
  const navigate = useNavigate();
  const { collapse, t } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [showMoreUserModal, setShowMoreUserModal] = useState(false);
  const [business_id, setBusinessId] = useState("");
  const [activePlan, setActivePlan] = useState("");
  const [userListData, setUserListData] = useState([]);
  const [userDataToDelete, setuserDataToDelete] = useState(null);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [additionalUsers, setAdditionalUsers] = useState("");
  const [totalEmployeeAddded, setTotalEmployeeAddded] = useState("");
  const [loader, setLoader] = useState(false);

  const openAddUserModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    fetchUserList(business_id);
    setShowModal(false);
  };

  const openMoreUserModal = () => {
    setTotalEmployeeAddded(userListData.length);
    setShowMoreUserModal(true);
  };

  const closeMoreUserModal = () => {
    fetchUserList(business_id);
    setShowMoreUserModal(false);
  };

  const openDeleteModal = (userData) => {
    setuserDataToDelete(userData);
    setShowUserDeleteModal(true);
  };

  const closeDeleteUserModal = () => {
    fetchUserList(business_id);
    setShowUserDeleteModal(false);
  };

  const getUserDetail = async () => {
    setLoader(true);
    const userDetailsData = await getUserDetails();
    const activePlan = userDetailsData.payDetail.plan_name;
    setActivePlan(activePlan);
    setBusinessId(userDetailsData.business_details[0]._id);
    setAdditionalUsers(userDetailsData.user.additional_users);
  };

  const fetchUserList = async (business_id) => {
    const payload = {
      business_id: business_id,
    };
    const usersList = await getUserList(payload);
    setUserListData(usersList.data);
    setLoader(false);
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    if (business_id) {
      fetchUserList(business_id);
    }
  }, [business_id]);

  return (
    <>
      <section
        className={`dashboard additional-users left-spacing ${
          collapse ? "expand" : ""
        }`}
      >
        <div className="customer-list d-flex align-items-center">
          <h1 className="mb-0 global-heading">
            {t("sideNavigation.additional_users")}{" "}
          </h1>
          {activePlan === "Ultimate" || activePlan === "ultimate_yearly" ? (
            <>
              {userListData.length <= additionalUsers - 1 ? (
                <button
                  type="button"
                  title="Add User"
                  className="button ms-auto m-0 add-user-btn"
                  onClick={openAddUserModal}
                >
                  {t("userComponent.addUser")}
                </button>
              ) : (
                <button
                  type="button"
                  title="Add User"
                  className="button ms-auto m-0 add-user-btn"
                  onClick={openMoreUserModal}
                >
                  {t("userComponent.addUser")}
                </button>
              )}
            </>
          ) : (
            ""
          )}
        </div>
        {loader === false ? (
          <>
            {activePlan === "Ultimate" || activePlan === "ultimate_yearly" ? (
              <DataTable
                value={userListData}
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
                className="customer-datatable"
                tableStyle={{ borderWidth: "0px" }}
              >
                <Column
                  header="S.No."
                  body={(rowData, { rowIndex }) => rowIndex + 1}
                />
                <Column
                  header={t("formField.email")}
                  body={(rowData) => `${rowData.email}`}
                />
                <Column
                  header={t("customerName.invitation_status")}
                  field="invitationStatus"
                  body={(rowData) =>
                    rowData.status === "active" ? (
                      rowData.first_name ? (
                        <>
                          <div className="verified-cell">
                            <span className="active">
                              {t("customerName.registered")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="verified-cell">
                            <span className="active">
                              {t("customerName.invited")}
                            </span>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="unverified-cell verified-cell">
                        <span className="inactive">
                          {t("customerName.deleted")}
                        </span>
                      </div>
                    )
                  }
                />

                <Column
                  header={t("customerName.action")}
                  body={(rowData) => (
                    <div className="action-cell">
                      <a
                        title="Delete"
                        className="error"
                        onClick={() => openDeleteModal(rowData)}
                      >
                        <i className="pi pi-trash danger" />
                      </a>
                    </div>
                  )}
                />
              </DataTable>
            ) : (
              <div className="text-center">
                <h3 className="mb-0 p-2">
                  {t("userComponent.upgrade_users")}{" "}
                </h3>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    title="Add User"
                    className="button btn-primary"
                    onClick={() =>
                      navigate("/app/subscriptions?user=additional-users")
                    }
                  >
                    {t("userComponent.upgrade_subscriptions")}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="spinner-loder">
              <span>
                <BeatLoader />
              </span>
            </div>
          </>
        )}

        <AddUserModal show={showModal} onRequestClose={closeModal} />
        <MoreUserModal
          show={showMoreUserModal}
          onRequestClose={closeMoreUserModal}
          totalEmployeeAddded={totalEmployeeAddded}
        />
        <DeleteUserModal
          show={showUserDeleteModal}
          onRequestClose={closeDeleteUserModal}
          userData={userDataToDelete}
        />
      </section>
    </>
  );
};
