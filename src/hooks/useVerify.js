import axios from "axios";

const useVerify = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      verify: false,
      dataFetch: {},
    };
  }

  if (token === "") {
    return {
      verify: false,
      dataFetch: {},
    };
  }

  const result = await axios.post(
    `${process.env.REACT_APP_SERVER}/auth/verify`,
    {
      token: token,
    }
  );

  if (result.data.code !== 200) {
    return {
      verify: false,
      dataFetch: {},
    };
  }
  return {
    verify: true,
    dataFetch: result.data.user,
  };
};

export default useVerify;
