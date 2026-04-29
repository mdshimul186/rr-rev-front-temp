import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  createCustomer,
  getCustomerDetailsById,
  updateCustomer,
} from "../../services/customer";
import { getAllStates } from "../../services/user";
import { CreateCustomerSchema } from "../../schema";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { Modal, Button } from "react-bootstrap";
import { PENDING } from "../../config/constant";

/**
 * CustomerModal component handles adding or editing customer details in a modal form.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {string} [props.customerId] - The ID of the customer being edited .
 * @param {string} props.business_id - The business ID associated with the customer.
 * @returns {JSX.Element} The rendered customer modal for adding and editing the customer.
 */
export const CustomerModal = ({
  show,
  onRequestClose,
  customerId,
  business_id,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [customerDetailsData, setCustomerDetailsData] = useState([]);
  const { t } = useOutletContext();
  const language = localStorage.getItem("language");
  const validation = CreateCustomerSchema(t("validations"));

  const getStates = async () => {
    const statesData = await getAllStates();
    setAllStates(statesData);
  };

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (customerId && show) {
      fetchCustomerDetails(customerId);
    }
  }, [customerId, show]);

  const { addCustomer, editCustomer, add, edit, cancel, note, enter_here } =
    t("customerComponent");

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      address: "",
      address_line2: "",
      contact: "",
      city: "",
      state: "",
      zip: "",
      customer_email: "",
      owner_type: "",
      notes: "",
    },
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const updatedCustomerData = {
        ...values,
        contact: `${phoneNumber}`,
      };
      try {
        if (customerId) {
          const payload = {
            ...values,
            contact: `${phoneNumber}`,
            customer_id: customerId,
            business_id: business_id,
          };
          const response = await updateCustomer(payload);
          if (response.success) {
            resetForm();
            setPhoneNumber("");
            onRequestClose(formik);
            setCustomerDetailsData(customerDetailsData.status === PENDING);
          }
        } else {
          const response = await createCustomer(updatedCustomerData);
          if (response.success) {
            resetForm();
            setPhoneNumber("");
            onRequestClose(formik);
          }
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    },
  });

  const onCloseBtn = () => {
    formik.resetForm();
    setPhoneNumber("");
    onRequestClose(formik);
    setCustomerDetailsData(customerDetailsData.status === PENDING);
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const payload = {
        customer_id: customerId,
        business_id: business_id,
      };
      const customerDetailsData = await getCustomerDetailsById(payload);
      const customerData = customerDetailsData.data[0];
      setCustomerDetailsData(customerData);
      if (customerId) {
        formik.setValues({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          address: customerData.address,
          address_line2: customerData.address_line2,
          contact: customerData.contact,
          city: customerData.city,
          state: customerData.state,
          zip: customerData.zip,
          customer_email: customerData.customer_email,
          owner_type: customerData.owner_type,
          notes: customerData.notes,
        });
        setPhoneNumber(customerData.contact);
      }
    } catch (error) {
      toast.error(error.response.data.data.message[language]);
    }
  };

  const {
    first_name,
    last_name,
    email,
    mobile_number,
    address,
    address_line2,
    city,
    state,
    zip_code,
    home_owner,
    renter,
    enter_first_name,
    enter_last_name,
    enter_customer_email,
    customer_address,
    customer_address2,
    enter_customer_city,
    select_customer_state,
    enter_customer_zipcode,
    owner_type,
  } = t("formField");

  return (
    <Modal
      show={show}
      onHide={() => {
        onCloseBtn();
      }}
      animation={true}
      size="lg"
      className="add-customer--modal modal"
      centered
    >
      <Modal.Header
        closeButton
        onClick={() => {
          onCloseBtn();
        }}
      >
        <Modal.Title>
          <h5 className="modal-title global-heading">
            {customerId ? editCustomer : addCustomer}
          </h5>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <div className="row">
            {/* Row 1 */}
            <div className="col-md-4 mb-4">
              <label htmlFor="first_name" className="form-label">
                {first_name}
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formik.values.first_name}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("first_name", value);
                }}
                onBlur={formik.handleBlur}
                placeholder={enter_first_name}
                className="form-control"
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div className="error">{formik.errors.first_name}</div>
              )}
            </div>
            <div className="col-md-4 mb-4">
              <label htmlFor="last_name" className="form-label">
                {last_name}
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                placeholder={enter_last_name}
                value={formik.values.last_name}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("last_name", value);
                }}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <div className="error">{formik.errors.last_name}</div>
              )}
            </div>

            {/* Row 2 */}
            <div className="col-md-4 mb-4">
              <label htmlFor="customer_email" className="form-label">
                {email}
              </label>
              <input
                type="email"
                className="form-control"
                id="customer_email"
                placeholder={enter_customer_email}
                value={formik.values.customer_email}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("customer_email", value);
                }}
                onBlur={formik.handleBlur}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="col-md-4 mb-4">
              <label htmlFor="contact" className="form-label">
                {mobile_number}
              </label>
              <PhoneInput
                country={"us"}
                defaultCountry="US"
                value={phoneNumber}
                // prefix="+"
                onlyCountries={["us"]}
                id="contact"
                onChange={setPhoneNumber}
                inputProps={{
                  name: "contact",
                  autoFocus: false,
                }}
                disableDropdown
                onBlur={() => formik.setFieldValue("contact", phoneNumber)}
              />
            </div>

            {/* Row 3 */}
            <div className="col-md-4 mb-4">
              <label htmlFor="address" className="form-label">
                {address}
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder={customer_address}
                value={formik.values.address}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("address", value);
                }}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              <label htmlFor="address_line2" className="form-label">
                {address_line2}
              </label>
              <input
                type="text"
                className="form-control"
                id="address_line2"
                placeholder={customer_address2}
                value={formik.values.address_line2}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("address_line2", value);
                }}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.address_line2 && formik.errors.address_line2 && (
                <div className="error">{formik.errors.address_line2}</div>
              )}
            </div>

            {/* Row 4 */}
            <div className="col-md-4 mb-4">
              <label htmlFor="city" className="form-label">
                {city}
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder={enter_customer_city}
                value={formik.values.city}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("city", value);
                }}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="error">{formik.errors.city}</div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              <label htmlFor="state" className="form-label">
                {state}
              </label>
              <select
                className="form-select"
                id="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              >
                <option value="">{select_customer_state}</option>
                {allStates.map((state) => (
                  <option key={state.Name} value={state.Name}>
                    {state.Name}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state && (
                <div className="error">{formik.errors.state}</div>
              )}
            </div>

            {/* Row 5 */}
            <div className="col-md-4 mb-4">
              <label htmlFor="zip" className="form-label">
                {zip_code}
              </label>
              <input
                type="text"
                className="form-control"
                id="zip"
                placeholder={enter_customer_zipcode}
                value={formik.values.zip}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("zip", value);
                }}
                onBlur={formik.handleBlur}
                disabled={customerDetailsData.status === "active"}
              />
              {formik.touched.zip && formik.errors.zip && (
                <div className="error">{formik.errors.zip}</div>
              )}
            </div>

            <div className="col-md-4 mb-4">
              <p className="radio-head">{owner_type}</p>
              <div className="owner-type--radio d-flex align-items-center">
                <div className="me-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="owner_type"
                    id="homeowner"
                    value="owner"
                    onChange={formik.handleChange}
                    checked={formik.values.owner_type === "owner"}
                    disabled={customerDetailsData.status === "active"}
                  />
                  <label className="form-check-label" htmlFor="homeowner">
                    {home_owner}
                  </label>
                </div>
                <div>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="owner_type"
                    id="rental"
                    value="rental"
                    onChange={formik.handleChange}
                    checked={formik.values.owner_type === "rental"}
                    disabled={customerDetailsData.status === "active"}
                  />
                  <label className="form-check-label" htmlFor="rental">
                    {renter}
                  </label>
                </div>
              </div>
              {formik.touched.owner_type && formik.errors.owner_type && (
                <div className="error">{formik.errors.owner_type}</div>
              )}
            </div>
            <div className="col-md-12 mb-4">
              <label htmlFor="zip" className="form-label">
                {note}
              </label>
              <textarea
                name="notes"
                id="notes"
                className="form-control"
                placeholder={enter_here}
                value={formik.values.notes}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  formik.setFieldValue("notes", value);
                }}
                onBlur={formik.handleBlur}
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button
            variant="secondary"
            type="button"
            title={cancel}
            onClick={() => {
              onRequestClose(formik);
            }}
            className="button close-btn"
          >
            {cancel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            title="Add"
            className="button"
          >
            {customerId ? edit : add}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
