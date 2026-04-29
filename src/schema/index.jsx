import * as Yup from "yup";

export const SignupSchema = (data) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .min(2, data?.too_short)
      .max(50, data?.too_long)
      .required(data?.first_name_required),
    last_name: Yup.string()
      .min(2, data?.too_short)
      .max(50, data?.too_long)
      .required(data?.last_name_required),
    contact: Yup.string()
      .max(12)
      .min(10, data?.min_contactDigit_required)
      .required(data?.phone_number_required),
    email: Yup.string()
      .email(data?.invalid_email)
      .required(data?.email_required),
    password: Yup.string()
      .min(8, data?.short_password)
      .required(data?.password_required)
      .matches(/[0-9]/, data?.password_number)
      .matches(/[@$!%*?&]/, data?.password_special),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], data?.match_password)
      .required(data?.confirm_password_required),
    terms: Yup.boolean()
      .required(data?.terms_condition)
      .oneOf([true], data?.terms_condition),
  });
};

export const newPassword = (data) => {
  return Yup.object().shape({
    oldPassword: Yup.string().required(data?.old_password),
    mNewPassword: Yup.string()
      .min(8, data?.short_password)
      .required(data?.new_password_required)
      .matches(/[0-9]/, data?.password_number)
      .matches(/[@$!%*?&]/, data?.password_special),
    mConfirmNewPassword: Yup.string()
      .oneOf([Yup.ref("mNewPassword"), null], data?.match_password)
      .required(data?.confirm_password_required),
  });
};

export const loginSchema = (data) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(data?.invalid_email)
      .required(data?.email_required),
    password: Yup.string()
      .min(8, data?.short_password)
      .required(data?.password_required),
  });
};

export const forgotPasswordSchema = (data) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(data?.invalid_email)
      .required(data?.email_required),
  });
};

export const resetPasswordSchema = (data) => {
  return Yup.object().shape({
    password: Yup.string()
      .min(8, data?.short_password)
      .matches(/[0-9]/, data?.password_number)
      .matches(/[@$!%*?&]/, data?.password_special),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], data?.match_password)
      .required(data?.confirm_password_required),
  });
};

export const BusinessRegistrationSchema = (data) => {
  return Yup.object().shape({
    business_name: Yup.string()
      .min(2, data.too_short)
      .max(250, data.business_name_max)
      .required(data.business_name_required),
    company_phone: Yup.string()
      .min(10, data?.min_contactDigit_required)
      .max(12, data?.max_contactDigit_required)
      .required(data?.company_number_required),
    business_address: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data.business_address_required),
    city: Yup.string().required(data.city_required),
    state: Yup.string().required(data.state_required),
    zip: Yup.string().required(data.zip_required),
  });
};

export const searchCustomerSchema = (data) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.first_name_required),
    last_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.last_name_required),
    address: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data.customer_address_required),
    city: Yup.string().required(data.city_required),
    state: Yup.string().required(data.state_required),
    zip: Yup.string().required(data.zip_required),
  });
};

export const CreateCustomerSchema = (data) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.first_name_required),
    last_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.last_name_required),
    address: Yup.string().required(data.customer_address_required),
    city: Yup.string().required(data.city_required),
    state: Yup.string().required(data.state_required),
    zip: Yup.string().required(data.zip_required),
    owner_type: Yup.string().required(data.owner_types),
  });
};

export const checkOutSchema = (data) => {
  return Yup.object().shape({
    cardholder_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.cardholder_name),
    billing_address: Yup.string().required(data?.billing_addresss),
    city: Yup.string().required(data?.city_required),
    zip: Yup.string().min(5, data.too_short).max(5, data?.too_long),
  });
};

export const ContactUs = (data) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.first_name_required),
    last_name: Yup.string()
      .min(2, data.too_short)
      .max(50, data?.too_long)
      .required(data?.last_name_required),
    contact: Yup.string()
      .max(12)
      .min(10, data?.min_contactDigit_required)
      .required(data?.mobile_number_is_required),
    email: Yup.string().email(data.invalid_email).required(data.email_required),
    subject: Yup.string().required(data.subject_required),
    message: Yup.string().required(data.message_required),
  });
};

export const payPerPlan = (data) => {
  return Yup.object().shape({
    plan_range: Yup.string().required(data?.plan_range_required),
  });
};

export const ReviewValidation = (data) => {
  return Yup.object().shape({
    terms: Yup.boolean().oneOf([true], data?.terms_condition),
    ratings: Yup.array().test(
      "ratings-selected",
      data?.select_ratings,
      (value) => value.some((rating) => rating > 0)
    ),
  });
};