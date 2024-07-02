import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { handleFormatMoney } from '../../utility/FormatData';
import { useContext } from 'react';
import { GlobalContext } from '../../context/Global';

function ProductItem({ product })
{
    const { handleAddToCart } = useContext(GlobalContext);
    return (
        <>
            <Card
                hoverable
                style={ {
                    width: 240,
                } }
                cover={ <img alt="example" src={ product.image } /> }
            >
                <div className="text-center flex flex-col gap-2">
                    <h3 className="font-semibold">{ product.productName }</h3>
                    <h3>{ handleFormatMoney(product.price) }</h3>
                    <Button onClick={ () => handleAddToCart(product) } type="primary"><ShoppingCartOutlined className="text-xl" />Thêm vào cửa hàng</Button>
                </div>
                {/* <Meta title="Iphone" description="Iphone 12 Pro Max" /> */ }
            </Card>
        </>);
}
export default ProductItem;