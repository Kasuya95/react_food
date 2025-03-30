import React, { useState, useEffect, useRef } from 'react';

const Header = ({ cart, removeFromCart, updateCartItemQuantity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // คำนวณราคารวมและจำนวนสินค้าทั้งหมด
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  
  // อัปเดตจำนวนสินค้าทั้งหมดเมื่อมีการเปลี่ยนแปลงใน cart
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(count);
  }, [cart]);
  
  // การตั้งค่า PromptPay
  const promptPayNumber = "0831542243"; // ตัวอย่างหมายเลข PromptPay
  const promptPayUrl = `https://promptpay.io/${promptPayNumber}?amount=${totalPrice}`;
  
  // ฟังก์ชันจัดการการเปลี่ยนแปลงจำนวนสินค้า
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else if (typeof updateCartItemQuantity === 'function') {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  // สร้าง ref สำหรับคลิกภายนอกเพื่อปิดดรอปดาวน์
  const dropdownRef = useRef(null);
  const receiptRef = useRef(null);

  // เพิ่ม event listener สำหรับการคลิกภายนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // สร้างเนื้อหาใบเสร็จ HTML
  const generateReceiptHTML = () => {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>ใบเสร็จรับเงิน</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 10px; }
            .payment-info { text-align: center; margin-top: 20px; padding: 10px; border: 1px dashed #ccc; }
          </style>
        </head>
        <body>
          <h2>🛒 ใบเสร็จรับเงินร้าน BBQ Shop</h2>
          <div style="text-align: right; margin-bottom: 10px;">
            <p><strong>เลขที่ใบเสร็จ:</strong> R-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
            <p><strong>วันที่:</strong> ${new Date().toLocaleString('th-TH')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>สินค้า</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">฿${item.price.toFixed(2)}</td>
                  <td style="text-align: right;">฿${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>รวมทั้งสิ้น: ฿${totalPrice}</p>
          </div>
          <div class="payment-info">
            <h3>ชำระเงินด้วย PromptPay</h3>
            <p>PromptPay: ${promptPayNumber}</p>
            <p style="font-size: 12px; margin-top: 10px;">ขอบคุณที่ใช้บริการ BBQ Shop</p>
          </div>
        </body>
      </html>
    `;
  };

  // ฟังก์ชันพิมพ์ใบเสร็จ
  const printReceipt = () => {
    // สร้างหน้าต่างใหม่สำหรับการพิมพ์
    const receiptContent = generateReceiptHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    
    // สั่งพิมพ์หลังจากโหลดเนื้อหาเสร็จ
    printWindow.onload = function() {
      printWindow.print();
      // ปิดหน้าต่างหลังจากสั่งพิมพ์ (อาจจะปิดอัตโนมัติหลังการพิมพ์ในบางเบราว์เซอร์)
      // printWindow.close();
    };
  };

  // ฟังก์ชันดาวน์โหลดใบเสร็จเป็น PDF
  const downloadReceipt = () => {
    const receiptContent = generateReceiptHTML();
    const fileName = `BBQ-Shop-Receipt-${new Date().getTime()}.html`;
    
    // สร้าง Blob จากเนื้อหา HTML
    const blob = new Blob([receiptContent], { type: 'text/html' });
    
    // สร้างลิงก์ดาวน์โหลด
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // เพิ่มลิงก์ไปยัง DOM, คลิก, และลบ
    document.body.appendChild(link);
    link.click();
    
    // ทำความสะอาด
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // แสดงใบเสร็จในโมดอล
  const showReceiptModal = () => {
    setShowReceipt(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="navbar bg-base-200 shadow-md p-4 fixed top-0 left-0 w-full z-50">
        <div className="flex-1">
          <a className="text-xl font-bold flex items-center">
            <span className="mr-2">🔥</span> BBQ Shop
          </a>
        </div>
        <div className="flex-none">
          {/* ตะกร้าสินค้า - ใช้การควบคุมด้วย state แทน dropdown class */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="btn btn-ghost btn-circle" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
            
            {/* แสดงเมนูเมื่อ isOpen เป็น true */}
            {isOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50"
              >
                <div className="card-body">
                  <h2 className="text-lg font-bold flex items-center">
                    <span className="mr-2">🛒</span> ตะกร้าสินค้า
                  </h2>
                  {cart.length === 0 ? (
                    <div className="text-gray-500 py-4 text-center">
                      <p>ตะกร้าของคุณว่างเปล่า</p>
                      <button 
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => setIsOpen(false)}
                      >
                        เลือกสินค้าเพิ่ม
                      </button>
                    </div>
                  ) : (
                    <>
                      <ul className="max-h-64 overflow-y-auto divide-y">
                        {cart.map((item) => (
                          <li key={item.id} className="flex justify-between items-center py-3">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">฿{item.price.toFixed(2)} / ชิ้น</p>
                            </div>
                            
                            {updateCartItemQuantity ? (
                              <div className="flex items-center mx-2">
                                <button 
                                  className="btn btn-xs btn-circle btn-ghost"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button 
                                  className="btn btn-xs btn-circle btn-ghost"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span className="mx-2">x {item.quantity}</span>
                            )}
                            
                            <div className="text-right min-w-20">
                              <p>฿{(item.price * item.quantity).toFixed(2)}</p>
                              <button 
                                className="text-red-500 text-xs hover:text-red-700" 
                                onClick={() => removeFromCart(item.id)}
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                ลบ
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t mt-2 pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>รวมทั้งสิ้น:</span>
                          <span>฿{totalPrice}</span>
                        </div>
                      </div>
                      
                      {/* QR Code สำหรับ PromptPay */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                        <h3 className="text-md font-semibold mb-2">ชำระเงินด้วย PromptPay</h3>
                        <div className="bg-white p-2 inline-block rounded-lg border border-gray-200">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(promptPayUrl)}`}
                            alt="PromptPay QR Code"
                            width="150"
                            height="150"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">สแกน QR code เพื่อชำระเงิน ฿{totalPrice}</p>
                        <p className="text-xs text-gray-500">PromptPay: {promptPayNumber}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button 
                          className="btn btn-outline flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          เลือกสินค้าเพิ่ม
                        </button>
                        <button
                          className="btn btn-primary flex-1"
                          onClick={showReceiptModal}
                        >
                          ยืนยันการสั่งซื้อ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* โมดอลใบเสร็จ */}
      {showReceipt && cart.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-screen overflow-y-auto" ref={receiptRef}>
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">ใบเสร็จรับเงิน</h2>
                <button 
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowReceipt(false)}
                >
                  ✕
                </button>
              </div>
              
              {/* เนื้อหาใบเสร็จ */}
              <div className="p-4 bg-white rounded-lg border">
                <h2 className="text-center text-xl font-bold mb-4">🛒 ใบเสร็จร้าน BBQ Shop</h2>
                
                <div className="text-sm mb-3">
                  <p><strong>เลขที่ใบเสร็จ:</strong> R-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                  <p><strong>วันที่:</strong> {new Date().toLocaleString('th-TH')}</p>
                </div>
                
                <table className="w-full border-collapse mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">สินค้า</th>
                      <th className="border p-2 text-center">จำนวน</th>
                      <th className="border p-2 text-right">ราคา</th>
                      <th className="border p-2 text-right">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2 text-center">{item.quantity}</td>
                        <td className="border p-2 text-right">฿{item.price.toFixed(2)}</td>
                        <td className="border p-2 text-right">฿{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="text-right text-lg font-bold mb-4">
                  <p>รวมทั้งสิ้น: ฿{totalPrice}</p>
                </div>
                
                <div className="text-center p-3 border border-dashed rounded-lg mt-4">
                  <h3 className="font-semibold mb-2">ชำระเงินด้วย PromptPay</h3>
                  <p className="text-sm text-gray-600">PromptPay: {promptPayNumber}</p>
                  <p className="text-xs text-gray-500 mt-2">ขอบคุณที่ใช้บริการ BBQ Shop</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                <button 
                  className="btn btn-outline"
                  onClick={printReceipt}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  พิมพ์ใบเสร็จ
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={downloadReceipt}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  ดาวน์โหลดใบเสร็จ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;