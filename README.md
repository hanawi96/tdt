# 🌸 Túi Dâu Tằm - Landing Page

Landing page bán túi dâu tằm giúp bé ngủ ngon, tối ưu cho mẹ bỉm sữa.

## ✨ Tính năng

- **Mobile-first design** - Tối ưu cho điện thoại (max-width: 768px)
- **Loading siêu nhanh** - Inline CSS/JS, tối ưu performance
- **UI chuyên nghiệp** - Màu sắc phù hợp mẹ bỉm sữa
- **Form validation** - Kiểm tra dữ liệu real-time
- **Auto-save orders** - Lưu vào Google Sheets tự động
- **Email notifications** - Thông báo đơn hàng mới
- **Cloudflare Workers** - Deployment toàn cầu

## 🚀 Quick Start

### 1. Clone và setup
```bash
git clone <repository>
cd tui-dau-tam
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Thiết lập Google Sheets
Xem hướng dẫn chi tiết trong [SETUP-GOOGLE-SHEETS.md](SETUP-GOOGLE-SHEETS.md)

### 4. Cấu hình
Cập nhật Google Apps Script URL trong `script.js`:
```javascript
GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

### 5. Build và deploy
```bash
npm run build
npm run deploy
```

## 📁 Cấu trúc dự án

```
tui-dau-tam/
├── index.html              # Landing page chính
├── style.css               # Tailwind CSS tùy chỉnh
├── script.js               # JavaScript functionality
├── _worker.js              # Cloudflare Worker
├── google-apps-script.js   # Google Apps Script
├── build.js                # Build script
├── package.json            # Dependencies
├── wrangler.toml           # Cloudflare config
├── tailwind.config.js      # Tailwind config
├── README.md               # Hướng dẫn này
└── SETUP-GOOGLE-SHEETS.md  # Hướng dẫn Google Sheets
```

## 🛠️ Development

### Local development
```bash
# Chạy local server
npx wrangler dev

# Hoặc mở trực tiếp index.html trong browser
```

### Build production
```bash
npm run build
```

### Deploy to Cloudflare
```bash
npm run deploy
```

## 📱 Mobile Optimization

### Responsive Design
- Max-width: 768px (tablet size)
- Touch-friendly buttons (min 44px)
- Optimized for one-hand use
- Fast loading on 3G/4G

### Performance
- Inline CSS/JS để giảm HTTP requests
- Optimized images và fonts
- Gzip compression
- CDN delivery via Cloudflare

### UX Features
- Auto-focus form fields
- Real-time validation
- Loading states
- Success/error feedback
- Smooth animations

## 🎨 Design System

### Colors (Mẹ bỉm sữa theme)
```css
/* Primary colors */
--mom-50: #fef7ff;
--mom-100: #fdf2f8;
--mom-500: #ec4899;  /* Main brand color */
--mom-600: #db2777;

/* Gradients */
background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%);
```

### Typography
- Font: Inter (Google Fonts)
- Mobile-optimized sizes
- Vietnamese character support

### Components
- Gradient buttons
- Card layouts
- Modal dialogs
- Form elements
- Trust badges

## 📊 Analytics & Tracking

### Conversion Tracking
```javascript
// Google Analytics (nếu cần)
gtag('event', 'purchase', {
  transaction_id: Date.now().toString(),
  value: orderData.price,
  currency: 'VND'
});
```

### Performance Monitoring
- Core Web Vitals
- Loading speed
- Mobile usability
- Conversion rate

## 🔧 Configuration

### Environment Variables
```javascript
// script.js
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'your-url-here',
  PHONE_REGEX: /^(0|\+84)[0-9]{9,10}$/,
  PRICES: {
    1: 299000,
    2: 549000,
    3: 799000
  }
};
```

### Wrangler Config
```toml
# wrangler.toml
name = "tui-dau-tam-landing"
main = "_worker.js"
compatibility_date = "2024-01-01"

[vars]
GOOGLE_APPS_SCRIPT_URL = "your-script-url"
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form validation works
- [ ] Order submission successful
- [ ] Email notifications received
- [ ] Mobile responsive
- [ ] Loading speed < 3s
- [ ] All links work
- [ ] Error handling

### Browser Testing
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Performance Testing
```bash
# Lighthouse audit
npx lighthouse https://your-domain.com --view

# PageSpeed Insights
# https://pagespeed.web.dev/
```

## 📈 Optimization Tips

### Speed Optimization
1. **Inline critical CSS/JS** - Giảm HTTP requests
2. **Optimize images** - WebP format, lazy loading
3. **Minify code** - Remove whitespace, comments
4. **Use CDN** - Cloudflare global network
5. **Cache strategy** - Browser và edge caching

### Conversion Optimization
1. **Clear CTA** - Button nổi bật, text rõ ràng
2. **Social proof** - Testimonials, reviews
3. **Trust signals** - Badges, guarantees
4. **Mobile UX** - Easy form filling
5. **Loading states** - User feedback

### SEO (nếu cần)
1. **Meta tags** - Title, description
2. **Structured data** - Product schema
3. **Open Graph** - Social sharing
4. **Sitemap** - XML sitemap
5. **Analytics** - Google Analytics

## 🚨 Troubleshooting

### Common Issues

**1. Form không submit được**
- Kiểm tra Google Apps Script URL
- Verify CORS settings
- Check browser console errors

**2. Email không nhận được**
- Kiểm tra spam folder
- Verify email trong Google Apps Script
- Check script permissions

**3. Mobile display issues**
- Test trên device thật
- Check viewport meta tag
- Verify CSS media queries

**4. Slow loading**
- Optimize images
- Check network requests
- Use Lighthouse audit

### Debug Mode
```javascript
// Bật debug trong script.js
const DEBUG = true;
if (DEBUG) {
  console.log('Debug info:', data);
}
```

## 📞 Support

### Contact
- **Email**: your-email@gmail.com
- **Phone**: 0123.456.789

### Resources
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

MIT License - Sử dụng tự do cho mục đích thương mại.

---

**🌸 Túi Dâu Tằm - Sản phẩm tin cậy cho bé yêu**
