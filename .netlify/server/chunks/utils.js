function handleLoginRedirect(event, message = "notAllowed") {
  const redirect = event.url.pathname + event.url.search;
  return `/login?redirectTo=${redirect}&message=${message}`;
}
export {
  handleLoginRedirect as h
};
