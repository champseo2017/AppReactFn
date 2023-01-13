import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import { imageUpload } from "services/uploadImageService";
import { AsyncPaginate } from "react-select-async-paginate";
import { categoriesReactSelect } from "utils/data";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCreatePin } from "utils/validationForm";
import PinService from "services/pinService";
import { CreatePinSlices } from "redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { useBeforeunload } from "react-beforeunload";


const defaultValues = {
  imageAsset: "",
  title: "",
  about: "",
  destination: "",
  category: null,
};

const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: "1.125rem",
    padding: "4px",
    cursor: "pointer",
    height: "47px",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    cursor: "pointer",
  }),
  // menu: base => ({
  //   ...base,
  //   cursor: "pointer",
  // }),
};

const CreatePin = (props) => {
  const {
    user,
    preventPath
  } = props
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setwrongImageType] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    watch,
    control,
    register,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schemaCreatePin),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    const { imageAsset, title, about, destination, category } = data;

    const doc = {
      _type: "pin",
      title,
      about,
      destination,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset?._id,
        },
      },
      userId: user._id,
      postedBy: {
        _type: "postedBy",
        _ref: user._id,
      },
      category: category?.value,
    };
    dispatch(CreatePinSlices.createPinLoading());
    const res = await PinService.createPin(doc);
    const { data: resCreatePin, error } = res;

    if (resCreatePin) {
      dispatch(CreatePinSlices.createPinSuccess(resCreatePin));
      reset();
      navigate("/");
    } else {
      dispatch(CreatePinSlices.createPinError(error));
    }
  };

  const getValueImages = watch("imageAsset");
  const getValueTitle = watch("title");
  const getValueAbout = watch("about");

  const uploadImage = async (e) => {
    e.preventDefault();
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setError("imageAsset", { type: "custom", message: "" });

      // setwrongImageType(false);
      setLoading(true);

      const resUpload = await imageUpload(e.target.files);
      const { data, error } = resUpload;

      if (data.length !== 0) {
        setValue("imageAsset", data);
        // setImageAsset(data);
        setLoading(false);
        clearErrors("imageAsset");
      } else {
        setError("imageAsset", { type: "custom", message: error });
        // setwrongImageType(true);
        setLoading(false);
      }
    } else {
      // setwrongImageType(true);
      setError("imageAsset", { type: "custom", message: "Error images type" });
    }
  };

  useBeforeunload((event) => {
    if (isDirty) {
      event.preventDefault();
      return "Are you sure you want to leave?";
    }
  });

  const [finishStatus, setfinishStatus] = useState(false);
  const goback = useLocation().state;
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    console.log("back button pressed", isDirty);
    if (!finishStatus) {
      if (window.confirm("Do you want to go back ?")) {
        setfinishStatus(true);
        // your logic
        navigate(goback || preventPath);
      } else {
        window.history.pushState(null, null, window.location.pathname);
        setfinishStatus(false);
      }
    }
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center items-center mt-5 lg:h-[80%]">
          {fields && (
            <p className="text-black-500 mb-5 text-xl transition duration-150 ease-in">
              Please fill in all the fields.
            </p>
          )}
          <div className="flex lg:flex-row flex-col justify-center items-center bg-gray-500 lg:p-5 p-3 lg:w-[80%] w-full">
            <div className="p-3 bg-secondaryColor flex flex-0.7 w-full">
              <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                {loading && <Spinner />}
                {errors && errors?.imageAsset?.message && (
                  <p>{errors?.imageAsset?.message}</p>
                )}
                {!getValueImages ? (
                  <label>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-[2rem]">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-lg">Click to upload an image</p>
                      </div>
                      <p className="mt-32 text-gray-500">
                        Use high-quality JPG, SVG, PNG GIF or TIFF less than 20
                        MB
                      </p>
                    </div>
                    <Controller
                      render={({ field }) => {
                        const { value } = field;
                        return (
                          <input
                            {...field}
                            type="file"
                            onChange={uploadImage}
                            className="w-0 h-0"
                            value={value}
                          />
                        );
                      }}
                      control={control}
                      name="imageAsset"
                    />
                  </label>
                ) : (
                  <div className="relative h-full">
                    <img
                      src={getValueImages?.url}
                      alt="uploaded-pic"
                      className="h-full w-full"
                    />
                    <button
                      type="button"
                      className="absolute bottom-[0.75rem] right-[0.75rem] p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-height duration-150 ease-in-out"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("imageAsset", "");
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
              <Controller
                render={({ field }) => {
                  const { value, onChange } = field;
                  return (
                    <input
                      {...field}
                      type="text"
                      onChange={onChange}
                      className="outline-none border-2 border-gray-300 p-2 rounded-lg text-base sm:text-lg font-bold"
                      value={value}
                      placeholder="Add your title here"
                      autoFocus={true}
                    />
                  );
                }}
                control={control}
                name="title"
              />
              {user && (
                <div className="flex gap-2 my-2 items-center bg-white rounded-lg p-2">
                  <img
                    src={user?.image}
                    className="w-10 h-10 rounded-full"
                    alt="user-profile"
                  />
                  <p className="font-bold">{user.userName}</p>
                </div>
              )}
              <Controller
                render={({ field }) => {
                  const { value, onChange } = field;
                  return (
                    <input
                      {...field}
                      type="text"
                      onChange={onChange}
                      className="outline-none border-2 border-gray-300 p-2 rounded-lg text-base sm:text-lg font-bold"
                      value={value}
                      placeholder="What is your pin about"
                    />
                  );
                }}
                control={control}
                name="about"
              />
              <Controller
                render={({ field }) => {
                  const { value, onChange } = field;
                  return (
                    <input
                      {...field}
                      type="text"
                      onChange={onChange}
                      className="outline-none border-2 border-gray-300 p-2 rounded-lg text-base sm:text-lg font-bold"
                      value={value}
                      placeholder="Add a destination link"
                    />
                  );
                }}
                control={control}
                name="destination"
              />
              <div className="flex flex-col">
                <div>
                  <p className="mb-2 font-semibold text-lg sm:text-xl">
                    Choose Pin Category
                  </p>
                  <Controller
                    render={({ field }) => {
                      const { value, onChange } = field;
                      return (
                        <AsyncPaginate
                          styles={customStyles}
                          value={value}
                          options={categoriesReactSelect}
                          onChange={onChange}
                          formatOptionLabel={(option) => (
                            <div className="flex items-center gap-2">
                              <img
                                src={option.image}
                                alt="category"
                                className="w-[2.1rem] h-[2.1rem] rounded-full"
                              />
                              <p>{option.label}</p>
                            </div>
                          )}
                        />
                      );
                    }}
                    control={control}
                    name="category"
                  />
                </div>
                <div className="flex justify-end items-end mt-5">
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="bg-red-500 cursor-pointer text-white font-bold p-2 rounded-full w-[7rem] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default CreatePin;
