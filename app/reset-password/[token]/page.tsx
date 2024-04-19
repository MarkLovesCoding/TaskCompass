import ResetPasswordComponent from "./ResetPasswordComponent";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const token = params.token;
  return <ResetPasswordComponent token={token} />;
};

export default ResetPassword;
