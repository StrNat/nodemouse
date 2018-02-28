# nodemouse

 [Raspberry Pi Mouse V2](https://www.rt-shop.jp/index.php?main_page=product_info&cPath=1348_1&products_id=3419)向け直進動作のサンプルプロジェクトです。

## 使い方

```
git clone https://github.com/StrNat/nodemouse.git
cd nodemouse
sudo npm install
sudo node src/main.js
```

## センサー値について

socket.ioを使いセンサー値のデータを出力しています。  
[専用のWebアプリ](https://github.com/StrNat/NodemouseConsole)から参照できます。