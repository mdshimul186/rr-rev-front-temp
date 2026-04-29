import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useOutletContext } from "react-router-dom";

export const BusinessList = () => {
  const businesses = [
    {
      id: 1,
      name: "Business Name 1",
      address: "Address 1",
      verification: "lorem ipsum",
    },
    {
      id: 2,
      name: "Business Name 2",
      address: "Address 2",
      verification: "lorem ipsum",
    },
    // Add more business objects as needed
  ];
  const [globalFilter, setGlobalFilter] = useState("");
  const { collapse } = useOutletContext();

  const [searchTerm] = useState("");

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { t } = useOutletContext();

  return (
    <section className={`dashboard left-spacing ${collapse ? "expand" : ""}`}>
      <h2 className="m-0 mb-3 global-heading">Business</h2>
      <div className="search-customers">
        <form className="d-grid grid-six--cols dashboard-section p-3 align-items-end">
          <div className="dashboard-inputfield">
            <label htmlFor="firstName" className="form-label">
              Business Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Business name"
              className="form-control clearNo"
            />
            <div className="error"></div>
          </div>
          <div className="dashboard-inputfield">
            <label htmlFor="lastName" className="form-label">
              Business Type
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Business Type"
              className="form-control clearNo"
            />
            <div className="error"></div>
          </div>
          <div className="dashboard-inputfield">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control clearNo"
              id="address"
              placeholder="Address"
            />
            <div className="error"></div>
          </div>
          <div className="dashboard-inputfield">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control clearNo"
              id="city"
              placeholder="City"
            />
            <div className="error"></div>
          </div>
          <div className="dashboard-inputfield">
            <label className="form-label">State</label>
            <select
              className="form-select"
              aria-label="Select your customer state"
              name="state"
              placeholder="State"
            >
              <option>State</option>
              <option>UP</option>
              <option>MP</option>
            </select>
            <div className="error"></div>
          </div>
          <div className="d-flex gap-4 dashboard-inputfield">
            <button type="submit" title="Search" className="button">
              Search
            </button>
            <button type="reset" title="Reset" className="button Cstm-ResetBtn">
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="AllBusinessListTable-Wrapper mt-3">
        {/* Search Input */}
        <div className="global-search mb-3">
          <input
            type="text"
            placeholder={t("userComponent.search_list")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="form-control"
          />
        </div>

        <>
          <DataTable
            value={filteredBusinesses}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rowClassName={(rowData) =>
              rowData.owner_type === "rental" ? "pending-row" : ""
            }
            className="customer-datatable"
            tableStyle={{ borderWidth: "0px" }}
          >
            <Column
              header={"Bussiness name"}
              body={(rowData) => `${rowData.name}`}
            />
            <Column
              header={"Address"}
              field="review"
              body={(rowData) => `${rowData.address}`}
            />
            <Column
              header={"Verify by third party"}
              body={(rowData) => `${rowData.verification}`}
            />
            <Column
              header={"Action"}
              body={() => (
                <div className="action-cell">
                  <span>
                    <a title="View">
                      <i className="pi pi-eye customer-Eye" />
                    </a>
                  </span>
                </div>
              )}
            />
          </DataTable>
        </>
      </div>
    </section>
  );
};
