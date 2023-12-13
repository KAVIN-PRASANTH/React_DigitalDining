import React, { useEffect } from "react";
import "../CSS_Files/Admin.css"
import AdminHeader from "../Components/AdminHeader";
import axios from "axios";
import Swal from "sweetalert2";

function Admin() {
    async function LoadContent() {
        await axios.get('/api/admin').then((data) => {
            let result = data.data;
            for (let i = 0; i < result.length; i++) {
                let email = result[i].email;
                let row = document.createElement('tr');
                let c1 = document.createElement('td');
                c1.textContent = i + 1;
                row.append(c1);
                let c2 = document.createElement('td');
                c2.textContent = result[i].email;
                row.append(c2);
                let c3 = document.createElement('td');
                c3.textContent = result[i].status == null ? "Inactive" : result[i].status;
                row.append(c3);
                let c4 = document.createElement('td');
                c4.textContent = result[i].amount == null ? "₹" + 0 : "₹" + result[i].amount;
                row.append(c4);
                let c5 = document.createElement('td');
                let access = document.createElement("button");
                if (result[i].status !== "Active") {
                    access.style = "padding:4px 25px;"
                    access.className = "btn btn-success";
                    access.textContent = "Activate";
                }
                else {
                    access.style = "padding:4px 20px"
                    access.className = "btn btn-danger";
                    access.textContent = "Dectivate";
                }
                c5.addEventListener('click', () => {
                    const action = result[i].status === "Active" ? 'Inactive' : 'Active';
                    Swal.fire({
                        title: `Are you sure you want to ${action === 'Inactive' ? 'Dectivate' : 'Activate'} this user?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            AccountSettings(action, email);
                        }
                    });
                })
                c5.append(access);
                row.append(c5);
                document.getElementById("admin_container").append(row);
            }

        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: "bg-danger"
                }
            })
        });
    }
    async function AccountSettings(requestType, email) {
        await axios.patch("/api/account_management", { requestType, email }).then((data) => {
            if (data.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: `User ${requestType === 'Inactive' ? 'Dectivate' : 'Activate'}d successfully.`,
                    icon: 'success',

                }).then((result) => {
                    if (result.isConfirmed) {
                        var container = document.getElementById('admin_container');
                        container.innerHTML = ''
                        LoadContent();
                    }
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Try again later',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: "bg-danger"
                    }
                })
            }

        }).catch(e => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: "bg-danger"
                }
            })
        });
    }
    useEffect(() => {
        LoadContent();
    }, [])
    return (
        <div style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh" }}>
            <div style={{ position: "absolute", height: "auto", backgroundColor: "antiquewhite" }} className="col-12">
                <br />
                <AdminHeader />
                <br />
                <div className="container" style={{ overflowX: "auto" }} >
                    <table class="table  table-striped bg-light" >
                        <thead style={{ backgroundColor: "darkorange" }}>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>TotalOrder</th>
                                <th >Access</th>

                            </tr>

                        </thead>
                        <tbody id="admin_container"></tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Admin;