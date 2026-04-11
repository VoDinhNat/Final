import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useState } from "react";
import CommonForm from "@/components/common/form";
import {addressFormControls} from "@/config";

const initialAddressFormData = {
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
}

function Address() {

    const [formData, setFormData] = useState(initialAddressFormData)

    const handleManageAddress = (event) => {
        event.preventDefault();
    }
    return <Card>
        <div>
            Address List
        </div>
        <CardHeader>
            <CardTitle>Add New Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText="Add"
            onSubmit={handleManageAddress}
            />

        </CardContent>
    </Card>
}

export default Address;
