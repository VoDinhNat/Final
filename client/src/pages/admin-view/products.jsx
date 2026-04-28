import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-title";
import CommonForm from "@/components/common/form";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {useToast} from "@/hooks/use-toast";
import {addProductFormElements} from "@/config";
import {addNewProduct, deleteProduct, editProduct, fetchAllProducts,} from "@/store/admin/products-slice";
import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FaPlus} from "react-icons/fa";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
};

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] =
        useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const {productList} = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();
    const {toast} = useToast();

    function normalizeProductPayload(payload) {
        return {
            ...payload,
            title: payload.title.trim(),
            description: payload.description.trim(),
        };
    }

    function onSubmit(event) {
        event.preventDefault();

        const updatedFormData = {
            ...normalizeProductPayload(formData),
            image: uploadedImageUrl || formData.image,
        };

        currentEditedId !== null
            ? dispatch(
                editProduct({
                    id: currentEditedId,
                    formData: updatedFormData,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    setUploadedImageUrl("");
                    toast({
                        title: "Product updated successfully",
                    });
                } else {
                    toast({
                        title: data?.payload?.message || "Failed to update product",
                        variant: "destructive",
                    });
                }
            }).catch((error) => {
                console.error("Error updating product:", error);
                toast({
                    title: error?.response?.data?.message || "Error occurred while updating product",
                    variant: "destructive",
                });
            })
            : dispatch(
                addNewProduct({
                    ...normalizeProductPayload(formData),
                    image: uploadedImageUrl,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    setUploadedImageUrl("");
                    toast({
                        title: "Product added successfully",
                    });
                } else {
                    toast({
                        title: data?.payload?.message || "Failed to add product",
                        variant: "destructive",
                    });
                }
            }).catch((error) => {
                console.error("Error adding product:", error);
                toast({
                    title: error?.response?.data?.message || "Error occurred while adding product",
                    variant: "destructive",
                });
            });
    }

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
        });
    }

    function isFormValid() {
        const formDataValid = Object.keys(formData)
            .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "image")
            .map((key) => {
                const value = formData[key];

                if (typeof value === "string") {
                    return value.trim() !== "";
                }

                return value !== "" && value !== null;
            })
            .every((item) => item);
        
        const imageValid = currentEditedId !== null || uploadedImageUrl !== "";
        
        return formDataValid && imageValid;
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <Fragment>
            <div className="mb-5 w-full flex">
                <Button onClick={() => setOpenCreateProductsDialog(true)}
                        style={{backgroundColor: '#1E90FF', color: '#ffffff'}}>
                    <FaPlus className="mr-2"/>
                    Add New Product
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {productList && productList.length > 0
                    ? productList.map((productItem) => (
                        <AdminProductTile
                            key={productItem.id}
                            setFormData={setFormData}
                            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            product={productItem}
                            handleDelete={handleDelete}
                        />
                    ))
                    : null}
            </div>
            <Dialog open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
                <DialogContent className="max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                    </DialogHeader>
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />
                    <div className="py-6">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default AdminProducts;
