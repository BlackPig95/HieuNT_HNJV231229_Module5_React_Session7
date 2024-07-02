import { createContext, useState } from "react";
import Header from "../layout/header/Header";
import ListProduct from "../components/product/ListProduct";
import ProductJSON from "../data.json";
//Tạo ngữ cảnh
export const GlobalContext = createContext();

function Global()
{
    //Khởi tạo dữ liệu ban đầu về danh sách products
    localStorage.setItem("products", JSON.stringify(ProductJSON.products));
    //Lấy thông tin trên local về để sử dụng
    const products = JSON.parse(localStorage.getItem("products"));
    //Lấy dữ liệu cart trên localStorage
    const [ carts, setCarts ] = useState(() =>
    {
        return JSON.parse(localStorage.getItem("carts")) || [];
    });
    /**
     * Hàm lưu và cập nhật dữ liệu
     * @param {*} key Key của dữ liệu trên local
     * @param {*} data Dữ liệu cần lưu
     */
    const handleSaveData = (key, data) =>
    {
        //Cập nhật vào state
        setCarts(data);
        //Lưu vào localStorage
        localStorage.setItem(key, JSON.stringify(data));
    };
    //Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) =>
    {
        //Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const findIndexProduct = carts.findIndex((cart) => cart.product.id === product.id);
        if (findIndexProduct === -1)
        {
            const newCart = {
                id: Math.ceil(Math.random() * 1000000),
                product: product,
                quantity: 1,
            };
            //Thêm mới
            const updateCart = [ ...carts, newCart ];
            // //Cập nhật vào state
            // setCarts(updateCart);
            // //Lưu vào localStorage
            // localStorage.setItem("carts", JSON.stringify(updateCart));
            handleSaveData("carts", updateCart);
        } else
        {
            const newCartUpdate = [ ...carts ];
            //Tăng số lượng
            newCartUpdate[ findIndexProduct ].quantity = newCartUpdate[ findIndexProduct ].quantity + 1;
            // //Cập nhật vào state
            // setCarts(newCartUpdate);
            // //Lưu vào localStorage
            // localStorage.setItem("carts", JSON.stringify(newCartUpdate));
            handleSaveData("carts", newCartUpdate);
        }
    };

    const dataGlobal = {
        products,
        carts: carts,
        handleAddToCart, //Cấu trúc destructuring
        cartLength: carts.length,
        handleSaveData,
    };
    return (<>
        <GlobalContext.Provider value={ dataGlobal }>
            <Header />
            <ListProduct />
        </GlobalContext.Provider>
    </>);
}

export default Global;