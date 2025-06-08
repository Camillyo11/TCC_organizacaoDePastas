function loadHeader() {
  const header = document.querySelector('header');
  if (!header) {
    console.error('Header element not found');
    return;
  }

  fetch('/frontend/assets/UserPages/header.html')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(data => {
      header.innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading header:', error);
    });
}
