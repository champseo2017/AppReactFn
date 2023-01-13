import * as yup from "yup";
export const schemaCreatePin = yup.object().shape({
  category: yup
    .object()
    .shape({
      image: yup.string(),
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required("This field is required."),
  imageAsset: yup
    .object()
    .shape({
      _id: yup.string(),
      url: yup.string(),
    })
    .nullable()
    .required("This field is required."),
  title: yup.string().required("This field is required."),
  about: yup.string().required("This field is required."),
  destination: yup.string().required("This field is required."),
});
