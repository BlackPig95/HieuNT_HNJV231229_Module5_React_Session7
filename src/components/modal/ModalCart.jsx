import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "../../context/Global";
import { handleFormatMoney } from "../../utility/FormatData";
import { Button, Drawer } from 'antd';
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";

function ModalCart({ onClose, openModal })
{
    const { carts, handleSaveData, products } = useContext(GlobalContext);
    //Dùng array để có thể hiển thị thông báo lỗi cho từng item trong shopping cart
    const [ errors, setErrors ] = useState([]);
    //Dùng để lưu các item được chọn cho việc thanh toán
    const [ checkedItems, setCheckedItems ] = useState([]);
    //Thông báo thanh toán thành công
    const [ successPayment, setSuccessPayment ] = useState("");
    const totalCost = useMemo(() =>
    {
        return checkedItems.reduce((total, currentItem) => total + (currentItem.product.price * currentItem.quantity), 0);
    }, [ checkedItems ]);
    /**
     * Hàm xử lý giảm số lượng sản phẩm trong giỏ hàng
     * @param {*} cartItem Sản phẩm hiện đang được chọn và bấm nút trừ số lượng
     * Nếu số lượng <=0 => Xóa sản phẩm khỏi giỏ hàng
     * Xử lý xóa thông báo lỗi khi giảm số sản phẩm < stock của sản phẩm trong kho
     */
    const handleMinusQuantity = (cartItem) =>
    {
        let updatedCart;
        //Nếu số lượng sản phẩm > 0
        if (cartItem.quantity > 0)
        {
            cartItem.quantity--;
            updatedCart = [ ...carts ];
            //Lọc ra các cartItem có sản phẩm mà id khác với id của sản phẩm được chọn
            setErrors([ ...errors.filter(e => e.id !== cartItem.id) ]);
        }
        else //Nếu số lượng sản phẩm = 0 => Xóa sản phẩm ra khỏi cart
        {
            //Filter trả ra mảng mới => Cần tạo mảng để lưu lại dữ liệu
            updatedCart = carts.filter(cart => cart.id !== cartItem.id);
        }
        //Dùng hàm đã tạo sẵn ở global context để update lại shopping cart
        handleSaveData("carts", updatedCart);
    };
    /**
     * Hàm xử lý tăng số lượng sản phẩm trong giỏ hàng thêm 1 khi bấm dấu cộng
     * @param {*} cartItem Sản phẩm hiện đang được chọn bấm nút cộng số lượng
     * Nếu số lượng sản phẩm được chọn > stock trong kho => Hiện thông báo lỗi và không cho cộng thêm
     */
    const handleAddQuantity = (cartItem) =>
    {
        //Nếu số lượng sản phẩm trong cartItem > stock của product trong kho
        if (cartItem.quantity >= cartItem.product.stock)
        {   //Tạo ra error mới, có id = id của cartItem được chọn để có thể check lỗi và hiển thị thông báo lỗi 
            //tương ứng cho mỗi item trong shopping cart 
            let newError = {
                id: cartItem.id,
                message: "Số lượng trong kho không đủ",
            };
            //Thêm thông báo lỗi vào mảng
            setErrors([ ...errors, newError ]);
        }
        else//Nếu số lượng sản phẩm của cartItem chưa vượt quá stock của product trong kho
        {
            cartItem.quantity++;
            //Lọc ra các thông báo lỗi khác id với item đang được chọn thành mảng mới để lưu vào state 
            //=> Loại bỏ được thông báo lỗi của item đang được chọn
            setErrors([ ...errors.filter(e => e.id !== cartItem.id) ]);
        }
        //Dùng hàm đã tạo sẵn ở global context để update lại shopping cart
        handleSaveData("carts", carts);
    };
    const handleCheckBox = (cartItem) =>
    {   //Nếu sản phẩm chưa có trong list được chọn thì thêm vào
        if (!checkedItems.find(c => c.id === cartItem.id))
        {
            setCheckedItems([ ...checkedItems, cartItem ]);
        }
        else//Nếu có rồi thì bỏ đi
        {
            setCheckedItems([ ...checkedItems.filter(c => c.id !== cartItem.id) ]);
        }
    };
    //Fake thanh toán => trừ số lượng sản phẩm trong localStorage của danh sách products
    const handlePayment = () =>
    {   //Mỗi checked là một cartItem (Có cart id, product và quantity)
        checkedItems.forEach(checked =>
        {   //So sánh xem có trùng id với product không thì trừ số lượng sản phẩm trong kho đi
            products.forEach(product =>
            {
                if (checked.product.id === product.id)
                {
                    product.stock -= checked.quantity;
                }
            }
            );
        }
        );
        setSuccessPayment("Thanh toán thành công");
        //Save lại dữ liệu vào localStorage
        localStorage.setItem("products", JSON.stringify(products));
    };
    return (
        <>
            <Drawer title="Danh sách sản phẩm trong giỏ hàng" onClose={ onClose } open={ openModal }>
                {
                    carts.map((cart) =>
                    {
                        return (
                            <div key={ cart.id } className="flex flex-row items-center border-2 border-black">
                                <li key={ cart.id } className="flex flex-col my-1 w-full" >
                                    <span> { cart.product.productName }</span>
                                    <span>Số lượng: { cart.quantity }</span>
                                    <span className="text-red-500">{ errors && errors.find(e => e.id === cart.id)?.message }</span>
                                    <img height={ "50px" } width={ "50px" } src={ cart.product.image } alt="Item image" />
                                    <span>Tổng tiền: { handleFormatMoney(cart.quantity * cart.product.price) }</span>
                                    <div>
                                        <button><MinusSquareOutlined onClick={ () => handleMinusQuantity(cart) } className="text-2xl" /></button>
                                        { <button><PlusSquareOutlined onClick={ () => handleAddQuantity(cart) } className="text-2xl" /></button> }
                                    </div>
                                </li>
                                <input type="checkbox" onClick={ () => handleCheckBox(cart) } style={ { height: "30px", width: "30px" } } />
                            </div>);
                    })
                }
                <p>Tổng hóa đơn: { totalCost }</p>
                <Button onClick={ handlePayment } type="primary">Thanh toán</Button>
                { successPayment && <p className="bg-green-500 text-white">{ successPayment }</p> }
            </Drawer>
        </>
    );
}

export default ModalCart;