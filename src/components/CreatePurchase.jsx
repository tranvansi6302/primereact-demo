import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Chips } from 'primereact/chips'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

export default function CreatePurchase() {
    const [variants, setVariants] = useState([])
    const [productName, setProductName] = useState('')
    const [productSku, setProductSku] = useState('')
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])
    const [bulkQuantity, setBulkQuantity] = useState(0)
    const [bulkPrice, setBulkPrice] = useState(0)
    const [selectedVariants, setSelectedVariants] = useState([])

    const generateVariants = () => {
        const newVariants = []

        sizes.forEach((size) => {
            colors.forEach((color) => {
                newVariants.push({
                    size,
                    color,
                    quantity: 0,
                    purchasePrice: 0,
                    sku: `${productSku}-${size}-${color.charAt(0)}`,
                    name: `${productName}-${size}-${color}`,
                })
            })
        })

        setVariants(newVariants)
    }

    // Áp dụng giá với số lượng hàng loạt
    const applyBulkChanges = () => {
        const newVariants = variants.map((variant) => ({
            ...variant,
            quantity: bulkQuantity,
            purchasePrice: bulkPrice,
        }))
        setVariants(newVariants)
    }

    const handleVariantChange = (index, key, value) => {
        const newVariants = [...variants]
        newVariants[index][key] = value
        setVariants(newVariants)
    }

    const handleDeleteVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index)
        setVariants(newVariants)
    }

    const handleSubmit = () => {
        const data = {
            purchaseOrderCode: 'PO123458',
            purchaseOrderDate: new Date().toISOString(),
            status: 1,
            note: 'Multiple variants with different quantities and prices',
            paymentStatus: 1,
            details: [
                {
                    productId: 2,
                    variantDetails: variants.map((variant) => ({
                        sizeId: variant.size,
                        colorId: variant.color,
                        quantity: variant.quantity,
                        purchasePrice: variant.purchasePrice,
                    })),
                },
            ],
        }
        console.log(data)
    }

    return (
        <div className=''>
            <div className='card flex flex-column align-items-center gap-3'>
                <InputText
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    type='text'
                    className='w-96'
                    placeholder='Tên sản phẩm'
                />
                <InputText
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    type='text'
                    className='w-64'
                    placeholder='SKU'
                />
            </div>
            <div className='card flex flex-column align-items-center gap-3'>
                <Chips
                    placeholder={sizes.length ? '' : 'Nhập kích thước sản phẩm'}
                    className='w-80'
                    value={sizes}
                    onChange={(e) => setSizes(e.value)}
                />
                <Chips
                    placeholder={colors.length ? '' : 'Nhập màu sắc sản phẩm'}
                    className='w-80'
                    value={colors}
                    onChange={(e) => setColors(e.value)}
                />
                <Button label='Hiển thị biến thể' icon='pi pi-refresh' iconPos='right' onClick={generateVariants} />
            </div>
            <div className='card flex flex-column align-items-center gap-3'>
                <InputText
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(parseInt(e.target.value, 10))}
                    type='number'
                    className='w-64'
                    placeholder='Số lượng hàng loạt'
                />
                <InputText
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(parseFloat(e.target.value))}
                    type='number'
                    className='w-64'
                    placeholder='Giá hàng loạt'
                />
                <Button label='Áp dụng hàng loạt' icon='pi pi-refresh' iconPos='right' onClick={applyBulkChanges} />
            </div>
            <div className='card'>
                <DataTable
                    value={variants}
                    selection={selectedVariants}
                    onSelectionChange={(e) => setSelectedVariants(e.value)}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column selectionMode='multiple' headerStyle={{ width: '3em' }}></Column>
                    <Column field='name' header='Tên biến thể'></Column>
                    <Column field='sku' header='SKU'></Column>
                    <Column
                        field='quantity'
                        header='Số lượng'
                        body={(rowData, options) => (
                            <InputText
                                type='number'
                                value={rowData.quantity}
                                onChange={(e) =>
                                    handleVariantChange(options.rowIndex, 'quantity', parseInt(e.target.value, 10))
                                }
                            />
                        )}
                    />
                    <Column
                        field='purchasePrice'
                        header='Giá nhập'
                        body={(rowData, options) => (
                            <InputText
                                type='number'
                                value={rowData.purchasePrice}
                                onChange={(e) =>
                                    handleVariantChange(options.rowIndex, 'purchasePrice', parseFloat(e.target.value))
                                }
                            />
                        )}
                    />
                    <Column
                        body={(rowData, options) => (
                            <Button
                                label='Loại bỏ'
                                icon='pi pi-trash'
                                className='p-button-danger'
                                severity='danger'
                                onClick={() => handleDeleteVariant(options.rowIndex)}
                            />
                        )}
                    />
                </DataTable>
            </div>
            <div className='card flex flex-column align-items-center gap-3'>
                <Button label='Xác nhận đơn hàng' icon='pi pi-check' iconPos='right' onClick={handleSubmit} />
            </div>
        </div>
    )
}
