export declare type Product = {
    id: string,
    name: string,
    description: string,
    price: number,
    thumbnail_url: string,
    options?: { [key: string]: any; };
    quantity?: number
}

export function getProducts() {
    const product1: Product = {
        id: 'ao',
        name: 'Áo thun',
        description: '',
        price: 34000,
        thumbnail_url: '/images/products/ao.png',
        options: [{ 'size': ['S', 'M', 'L', 'XL'] }]
    }
    const product2: Product = {
        id: 'gia-do-laptop',
        name: 'Giá đỡ laptop',
        description: '',
        price: 34000,
        thumbnail_url: '/images/products/gia-do-laptop.png',
        options: [{ 'size': ['14 inch', '15 inch'] }]

    }
    const product3: Product = {
        id: 'sticker',
        name: 'Sticker',
        description: '',
        price: 34000,
        thumbnail_url: '/images/products/sticker.png',
        options: [{ 'type': ['1', '2', '3'] }]

    }
    const product4: Product = {
        id: 'binh-nuoc',
        name: 'Bình nước LocknLock',
        description: '',
        price: 34000,
        thumbnail_url: '/images/products/binh-nuoc.png'

    }
    const product5: Product = {
        id: 'tui-phu-kien',
        name: 'Túi phụ kiện',
        description: '',
        price: 34000,
        thumbnail_url: '/images/products/tui-phu-kien.png'
    }

    return [product1, product2, product3, product4, product5]
}
