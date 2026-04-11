import {useEffect, useState} from "react";
import CommonForm from "../common/form";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {addressFormControls} from "@/config";
import {useDispatch, useSelector} from "react-redux";
import {addNewAddress, deleteAddress, editaAddress, fetchAllAddresses,} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import {useToast} from "@/hooks/use-toast";

const initialAddressFormData = {
    address: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    number: "",
    phone: "",
    pincode: "",
    notes: "",
};

function Address({setCurrentSelectedAddress, selectedId}) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {addressList} = useSelector((state) => state.shopAddress);
    const {toast} = useToast();

    useEffect(() => {
        const {number, street, ward, district} = formData;

        const fullAddressParts = [number, street, ward, district]
            .filter((part) => part.trim() !== "");

        let fullAddress = fullAddressParts.join(", ");
        if (number && fullAddress.startsWith(`${number},`)) {
            fullAddress = fullAddress.replace(`${number},`, `${number}`);
        }

        if (formData.address !== fullAddress) {
            setFormData((prev) => ({...prev, address: fullAddress}));
        }
    }, [formData.number, formData.street, formData.ward, formData.district]);


    function handleManageAddress(event) {
        event.preventDefault();

        if (addressList.length >= 4 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({
                title: "You can add max 4 addresses",
                variant: "destructive",
            });

            return;
        }

        currentEditedId !== null
            ? dispatch(
                editaAddress({
                    userId: user?.id,
                    addressId: currentEditedId,
                    formData,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address updated successfully",
                    });
                }
            })
            : dispatch(
                addNewAddress({
                    ...formData,
                    userId: user?.id,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address added successfully",
                    });
                }
            });
    }

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(
            deleteAddress({userId: user?.id, addressId: getCurrentAddress._id})
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully",
                });
            }
        });
    }

    function handleEditAddress(getCuurentAddress) {
        setCurrentEditedId(getCuurentAddress?._id);

        const addressParts = getCuurentAddress?.address.split(",").map(part => part.trim());

        const numberAndStreet = addressParts[0] || "";

        const [number, ...streetParts] = numberAndStreet.split(" ");
        const street = streetParts.join(" ") || "";

        const ward = addressParts[1] || "";
        const district = addressParts[2] || "";

        setFormData({
            address: getCuurentAddress?.address || "",
            city: getCuurentAddress?.city || "",
            district,
            ward,
            street,
            number,
            phone: getCuurentAddress?.phone || "",
            pincode: getCuurentAddress?.pincode || "",
            notes: getCuurentAddress?.notes || "",
        });
    }


    function isFormValid() {
        return Object.keys(formData)
            .filter((key) => key !== "notes")
            .map((key) => formData[key].trim() !== "")
            .every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                {addressList && addressList.length > 0
                    ? addressList.map((singleAddressItem) => (
                        <AddressCard
                            selectedId={selectedId}
                            handleDeleteAddress={handleDeleteAddress}
                            addressInfo={singleAddressItem}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                        />
                    ))
                    : null}
            </div>
            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? "Edit Address" : "Add New Address"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? "Edit" : "Add"}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                    buttonStyle={currentEditedId !== null
                        ? {backgroundColor: '#ecdc4c', color: 'black'}
                        : {backgroundColor: 'red', color: 'white'}}
                />
            </CardContent>
        </Card>
    );
}

export default Address;
