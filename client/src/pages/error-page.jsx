import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1 className="mx-auto">Oops!</h1>
      <p className="mx-auto mt-2">Sorry, an unexpected error has occurred.</p>
      <p className="mx-auto mb-2">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
export default ErrorPage