const txtName = document.getElementById("txtName");
const txaAddress = document.getElementById("txaAddress");
const txtEmail = document.getElementById("txtEmail");
const txtPhone = document.getElementById("txtPhone");
const image = document.getElementById("image");

loadtable();

async function loadtable() {
  let stdTable = document.getElementById("tblStudent");

  let body = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Address</th>
      <th>Email</th>
      <th>Phone Number</th>
    </tr>`;

  const studentList = await fetch("http://localhost:8080/student").then((res) =>
    res.json()
  );

  studentList.forEach((element) => {
    body += `
      <tr data-id="${element.id}" onclick="getDetails(${element.id})" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td>${element.address}</td>
        <td>${element.email}</td>
        <td>${element.phone}</td>
        
      </tr>`;
  });

  stdTable.innerHTML = body;
}

function clearForm() {
  txtName.value = null;
  txaAddress.value = null;
  txtEmail.value = null;
  txtPhone.value = null;
  image.value = null;
  document.getElementById("imgPreview").style.display = "none";
}

function addStudent() {
  const name = txtName.value;
  const address = txaAddress.value;
  const phone = txtPhone.value;
  const email = txtEmail.value;
  const img = image.files[0];

  const formData = new FormData();
  formData.append(
    "student",
    new Blob(
      [
        JSON.stringify({
          name: name,
          address: address,
          email: email,
          phone: phone,
        }),
      ],
      { type: "application/json" }
    )
  );
  formData.append("image", img);

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  fetch("http://localhost:8080/student", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      loadtable();
    })
    .catch((error) => console.error("Error:", error));

  clearForm();
}

function getDetails(id) {
  let studentid = document.getElementById("studentid");
  let studentName = document.getElementById("studentName");
  let studentaddress = document.getElementById("studentaddress");
  let studentphone = document.getElementById("studentphone");
  let studentemail = document.getElementById("studentemail");
  let studentpic = document.getElementById("pic");

  fetch(`http://localhost:8080/student/${id}`)
    .then((res) => res.json())
    .then((data) => {
      studentid.value = data.id;
      studentName.value = data.name;
      studentaddress.value = data.address;
      studentphone.value = data.phone;
      studentemail.value = data.email;

      // Set the image in the modal
      studentpic.src = `data:image/*;base64,${data.image}`;

      //form data load

      txtName.value = data.name;
      txaAddress.value = data.address;
      txtPhone.value = data.phone;
      txtEmail.value = data.email;

      // Set the image in the modal
      const img = `data:image/*;base64,${data.image}`;
      const pic = document.getElementById("pic");
      pic.src = img;
      document.getElementById("imgPreview").src = img;
      document.getElementById("imgPreview").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

// Add event listener for file input change
image.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imgPreview.src = event.target.result;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imgPreview.style.display = "none";
  }
});

async function updateStudent() {
  const id = document.getElementById("studentid").value;
  const name = txtName.value;
  const address = txaAddress.value;
  const phone = txtPhone.value;
  const email = txtEmail.value;
  const img = image.files[0];

  const student = await fetch(`http://localhost:8080/student/${id}`).then(
    (res) => res.json()
  );
  const formData = new FormData();
  formData.append(
    "student",
    new Blob(
      [
        JSON.stringify({
          id:id,
          name: name,
          address: address,
          email: email,
          phone: phone,
        }),
      ],
      { type: "application/json" }
    )
  );
  formData.append("image", img);

  const requestOptions = {
    method: "PUT",
    body: formData,
    redirect: "follow",
  };

  fetch("http://localhost:8080/student/image", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      loadtable();
    })
    .catch((error) => console.error("Error:", error));


  clearForm();
  loadtable();
}

async function deleteStudent() {
  const id = document.getElementById("studentid").value;
  const raw = "";

  const requestOptions = {
    method: "DELETE",
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/student/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

  clearForm();
  loadtable();
}
