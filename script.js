// ========================================================
// SIĞINAK - PUAN SİSTEMLİ, XSS KORUMALI VE KESİNTİSİZ MOTOR (V1.0)
// ========================================================

let aktifRumuz = "";
let kullaniciPuan = 0;
let toplamYorumSayisi = 0;
let guncelFiltre = "tumu";
let alevAtilanlar = []; 

const kategoriIsimleri = {
    'zaman': 'Zaman Hırsızlığı',
    'itaat': 'İtaat Testi',
    'mulakat': 'Mülakat Rezilliği',
    'vaat': 'Vaat vs. Gerçek',
    'ekmek': 'Ekmek Davası',
    'hak': 'Hakkını Verenler',
    'serbest': 'Serbest Kürsü'
};

// Sığınağın başlangıç konusu (Hafıza boşsa bu görünür)
let tumKonular = [
    {
        id: 1001,
        yazar: "Sistem_Kurucu",
        kategori: "mulakat",
        metin: "Sığınağın temelleri atıldı. Artık burası yıkılmaz. Kurumsal yalanlara karşı tek ses olma vakti!",
        alevSayisi: 50,
        yorumlar: []
    }
];

// --- ORTAK KAYIT MOTORU ---
function verileriKaydet() {
    localStorage.setItem('siginak_konular', JSON.stringify(tumKonular));
    localStorage.setItem('siginak_alevler', JSON.stringify(alevAtilanlar));
}


// 2. SAYFA YÜKLENİNCE (Tüm Hafıza ve Değişken Yüklemeleri Tek Bir Çatı Altında)
window.onload = function() {
    // Hafızadaki verileri çekiyoruz
    const kayitliRumuz = localStorage.getItem('siginak_rumuz');
    const kayitliPuan = localStorage.getItem('siginak_puan');
    const kaydedilmisKonular = localStorage.getItem('siginak_konular');
    const kaydedilmisAlevler = localStorage.getItem('siginak_alevler');
    
    if (kayitliRumuz) aktifRumuz = kayitliRumuz;
    if (kayitliPuan) kullaniciPuan = parseFloat(kayitliPuan) || 0;
    if (kaydedilmisKonular) tumKonular = JSON.parse(kaydedilmisKonular);
    if (kaydedilmisAlevler) alevAtilanlar = JSON.parse(kaydedilmisAlevler);

    const input = document.getElementById('profil-rumuz-input');
    if (input && aktifRumuz) input.value = aktifRumuz;

    // Kullanıcının toplam yorum sayısını hafızadaki verilere göre hesapla
    toplamYorumSayisi = 0;
    tumKonular.forEach(k => {
        if (k.yorumlar) {
            toplamYorumSayisi += k.yorumlar.filter(y => y.yazar === aktifRumuz).length;
        }
    });
    const profilYorumSpan = document.getElementById('profil-sayac-yorum');
    if (profilYorumSpan) profilYorumSpan.innerText = toplamYorumSayisi;

    anaSayfaSayaclariniGuncelle();
    
    try {
        puanEkle(0); // Arayüz elementlerini ve rütbeyi senkronize et
    } catch (e) {
        console.log("Rütbe hesaplama hatası:", e);
    }

    /* ==========================================================================
       🚀 EKRAN YÜKLEME VE SİYAH EKRAN KORUMASI
       ========================================================================== */
    // Hafıza sıfırlanmışsa veya ilk girişse direkt 'dashboard' (ana sayfa) yüklenecek.
    const sonEkran = localStorage.getItem('son_ekran') || 'dashboard';
    
    // Sığınağın kapılarını beklemeden direkt açıyoruz
    ekranDegistir(sonEkran);
};

// --- PUAN VE RÜTBE MOTORU ---
function rutbeHesapla(puan) {
    if (puan >= 1000) return { ad: "Sistem Sarsıcı", kalan: 0, barYuzde: 100 };
    if (puan >= 500) return { ad: "Kıdemli Mağdur", kalan: 1000 - puan, barYuzde: ((puan - 500) / 500) * 100 };
    if (puan >= 200) return { ad: "Siren Çalan", kalan: 500 - puan, barYuzde: ((puan - 200) / 300) * 100 };
    return { ad: "Gözlemci", kalan: 200 - puan, barYuzde: (puan / 200) * 100 };
}

function puanEkle(miktar) {
    kullaniciPuan += miktar;
    kullaniciPuan = Math.round(kullaniciPuan * 10) / 10;
    localStorage.setItem('siginak_puan', kullaniciPuan);
    const rutbe = rutbeHesapla(kullaniciPuan);
    
    // Arayüzdeki tüm rütbe alanlarını güvenle güncelle
    const rAd = document.getElementById('profil-rutbe-adi');
    const rPuan = document.getElementById('profil-toplam-puan');
    const rKalan = document.getElementById('profil-kalan-puan');
    const rBar = document.getElementById('profil-seviye-bar-ic');
    const dashR = document.getElementById('rutbe-dashboard');
    const konuR = document.getElementById('rutbe-konular');

    if(rAd) rAd.innerText = rutbe.ad;
    if(rPuan) rPuan.innerText = `Mevcut Puan: ${kullaniciPuan} XP`;
    if(rKalan) {
        let kalanPuan = Math.round(rutbe.kalan * 10) / 10;
        rKalan.innerText = rutbe.kalan > 0 ? `Sonraki Rütbeye: ${kalanPuan} Puan` : "En üst rütbedesin şef!";
    }
    if(rBar) rBar.style.width = `${rutbe.barYuzde}%`;
    if (dashR) dashR.innerText = rutbe.ad;
    if (konuR) konuR.innerText = rutbe.ad;
}

// --- SAYAÇ MOTORU ---
function anaSayfaSayaclariniGuncelle() {
    const kategoriler = ['zaman', 'itaat', 'mulakat', 'vaat', 'ekmek', 'hak', 'serbest'];
    kategoriler.forEach(kat => {
        const sayacSpan = document.getElementById(`sayac-${kat}`);
        if (sayacSpan) sayacSpan.innerText = tumKonular.filter(k => k.kategori === kat).length;
    });

    const profilKonuSpan = document.getElementById('profil-sayac-konu');
    if (profilKonuSpan) {
        profilKonuSpan.innerText = aktifRumuz !== "" ? tumKonular.filter(k => k.yazar === aktifRumuz).length : 0;
    }
}

// --- SAYFA GEÇİŞ MOTORU ---
function ekranDegistir(ekranId) {
    // 1. Tüm ekranları kapat ve active sınıfını temizle
    document.querySelectorAll('.proje-ekran').forEach(e => {
        e.style.display = 'none';
        e.classList.remove('active');
    });

    // 2. Navigasyonu sıfırla
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    // 3. AKILLI ID YAKALAMA (Hem "ekran-dashboard" hem de "dashboard" yapısını otomatik destekler)
    let hedef = document.getElementById('ekran-' + ekranId) || document.getElementById(ekranId);
    
    if (hedef) {
        // CSS yapına göre 'block' veya 'flex' yapabilirsin. Sayfa düzenin hangisiyse onu seç:
        hedef.style.display = 'block'; 
        hedef.classList.add('active');
        
        // Kalınan son ekranı hafızaya güvenle yaz
        localStorage.setItem('son_ekran', ekranId); 
        
        // 4. Eğer konular ekranındaysak akışı tazele
        if (ekranId === 'konular') {
            if (typeof konulariEkranaBas === 'function') {
                konulariEkranaBas(guncelFiltre);
            }
        }
    } else {
        console.error(`HATA: HTML içinde "ekran-${ekranId}" veya "${ekranId}" ID'sine sahip bir sayfa bulunamadı!`);
    }

    // 5. Alt menüdeki (Nav) ilgili butonu aktif et (Hem "nav-konular" hem "konular" ID'lerini destekler)
    const navItem = document.getElementById('nav-' + ekranId) || document.getElementById(ekranId);
    if (navItem) navItem.classList.add('active');
}

// --- PROFiL RUMUZ MOTORU ---
function rumuzKaydet() {
    const input = document.getElementById('profil-rumuz-input');
    if (!input) return;
    const yeniRumuz = input.value.trim();
    
    const sonDegisim = localStorage.getItem('siginak_son_rumuz_degisim');
    const simdi = new Date().getTime();
    const birAy = 30 * 24 * 60 * 60 * 1000;

    if (sonDegisim && (simdi - sonDegisim < birAy)) {
        alert("Şef, rumuzunu sadece ayda bir kere değiştirebilirsin. Biraz bekle!");
        return;
    }

    if(yeniRumuz === "") { alert("Boş bırakma şef!"); return; }
    if(yeniRumuz === aktifRumuz) return;

    // Eski paylaşımları ve yorumları yeni rumuza devret
    tumKonular.forEach(konu => {
        if (konu.yazar === aktifRumuz) konu.yazar = yeniRumuz;
        if (konu.yorumlar) {
            konu.yorumlar.forEach(yorum => {
                if (yorum.yazar === aktifRumuz) yorum.yazar = yeniRumuz;
            });
        }
    });

    aktifRumuz = yeniRumuz;
    localStorage.setItem('siginak_rumuz', aktifRumuz);
    localStorage.setItem('siginak_son_rumuz_degisim', simdi);
    
    verileriKaydet(); 
    alert("Rumuz güncellendi! Eski paylaşımların yeni rumuzuna taşındı şef.");
    anaSayfaSayaclariniGuncelle();
    konulariEkranaBas(guncelFiltre);
}

// --- YENİ KONU GÖNDERME ---
function konuGonder() {
    if (aktifRumuz === "") { alert("Önce profilden rumuz al şef!"); ekranDegistir('profil'); return; }

    const icerikAlani = document.getElementById('konu-icerik');
    const metin = icerikAlani.value.trim();
    if (metin === "") { alert("Boş gönderemezsin!"); return; }

    const anlikTarih = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + " " + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const mevcutRutbe = rutbeHesapla(kullaniciPuan).ad;

    const yeniKonu = {
        id: Date.now(),
        yazar: aktifRumuz,
        rutbe: mevcutRutbe, // Konu açıldığı anki rütbe karta işlenir
        kategori: document.getElementById('kategori-secim').value,
        metin: metin,
        tarih: anlikTarih,
        alevSayisi: 0,
        yorumlar: []
    };

    tumKonular.unshift(yeniKonu);
    verileriKaydet(); 
    
    icerikAlani.value = "";
    puanEkle(5); // Konu açana +5 XP
    anaSayfaSayaclariniGuncelle();
    
    alert("Paylaşımın sığınağa ulaştı! +5 XP Kazandın.");
    ekranDegistir('konular');
}

// --- AKILLI RENDER VE GÜVENLİK ---
function konulariEkranaBas(filtre = "tumu") {
    guncelFiltre = filtre;
    const akisKutusu = document.getElementById('konular-akisi');
    if (!akisKutusu) return;

    // Sabit Üst Duyuru Kutusu
    akisKutusu.innerHTML = `
        <div class="siginak-duyuru-kutusu" style="width: 100%; max-width: 650px; margin: 0 auto 20px auto; box-sizing: border-box;">
            <h3>📻 Sığınak Telsiz Komutanlığı (V1.0 - Prototip Sürüm)</h3>
            <p>Şef, sığınağın ilk test sahasındasın. Mesajların ve rütben güvenlik protokolü gereği <b>sadece bu cihazın yerel hafızasında (LocalStorage)</b> saklanır. Yakında merkezi veritabanına geçeceğiz.</p>
            <hr class="duyuru-cizgi">
            <p class="duyuru-iletisim">
                🛠️ <b>Mühendislik & Ortaklık Çağrısı:</b> <br>
                Sığınağı genişletiyoruz. Fikir bildirmek, hata raporlamak veya <u>"Ben de kod yazarım, backend/tasarım tarafında cepheye katılırım"</u> diyen yazılımcı dostlar için iletişim frekansı: <br>
                📩 <a href="mailto:siginakiletisim@proton.me">siginakiletisim@proton.me</a>
            </p>
        </div>
    `;

    const kategoriRenkleri = {
        'zaman': '#dd0a0a',      
        'mulakat': '#e67e22',    
        'itaat': '#3498db',      
        'vaat': '#9b59b6',       
        'ekmek': '#e7bf3c',      
        'hak': '#2ecc71',        
        'serbest': '#555555'     
    };

    tumKonular.forEach(konu => {
        if (filtre !== "tumu" && konu.kategori !== filtre) return; 
        
        const renk = kategoriRenkleri[konu.kategori] || '#3498db';
            
        // Yorumları XSS korumalı şekilde listeleme
        let yorumlarHTML = (konu.yorumlar || []).map(y => {
            return `
                <div class="tek-yorum">
                    <span class="yorum-tarih">[${y.tarih || '?'}]</span> <b>${metniGuvenliYap(y.yazar)}:</b> ${metniGuvenliYap(y.metin)}
                </div>
            `;
        }).join('');

        const hamMetin = konu.metin ? konu.metin : "Sığınak telsiz mesajı boş şef... 📻";
        const konuMetniGoster = metniGuvenliYap(hamMetin); 

        const kartHTML = `
            <div class="konu-karti" id="kart-${konu.id}">
                <div class="konu-ust-bar">
                    <span class="konu-yazar">${metniGuvenliYap(konu.yazar)}</span>
                    <span class="rutbe-badge">${metniGuvenliYap(konu.rutbe || 'Gözlemci')}</span>
                    <span class="konu-tarih">${konu.tarih || 'Az önce'}</span>
                    
                    <span class="konu-badge" style="background:${renk}; margin-left: auto;">
                        ${kategoriIsimleri[konu.kategori] || 'Genel'}
                    </span>
                    ${konu.yazar === aktifRumuz ? `<button class="sil-btn" onclick="konuSil(${konu.id})">🗑️</button>` : ''}
                </div>
                
                <div id="metin-alan-${konu.id}" class="konu-icerik">${konuMetniGoster}</div>
                
                <div class="konu-alt-bar">
                    <button class="etkilesim-btn alev-btn" onclick="alevAt(${konu.id})">🔥 <span id="alev-sayi-${konu.id}">${konu.alevSayisi}</span></button>
                    <button class="etkilesim-btn" onclick="toggleYorumKutusu(${konu.id})">💬 <span id="yorum-sayac-${konu.id}">${konu.yorumlar ? konu.yorumlar.length : 0} Yorum</span></button>
                </div>
                
                <div id="yorum-kutusu-${konu.id}" class="yorumlar-alani" style="display: none !important;">
                    <div class="yorumlar-listesi" id="yorum-listesi-${konu.id}">${yorumlarHTML}</div>
                    <div class="yorum-yazma-formu">
                        <input type="text" id="yorum-input-${konu.id}" placeholder="Destek at şef..." onkeydown="if(event.key==='Enter') yorumEkle(${konu.id})">
                        <button onclick="yorumEkle(${konu.id})">Gönder</button>
                    </div>
                </div>
            </div>
        `;
        akisKutusu.insertAdjacentHTML('beforeend', kartHTML);
    });
}
// --- ETKİLEŞİM VE SPAM FİLTRESİ ---
function alevAt(konuId) {
    if (alevAtilanlar.includes(konuId)) { alert("Zaten alev attın şef! 🔥"); return; }

    const konu = tumKonular.find(k => k.id === konuId);
    if (konu) {
        konu.alevSayisi++;
        document.getElementById(`alev-sayi-${konuId}`).innerText = konu.alevSayisi;
        alevAtilanlar.push(konuId);
        
        verileriKaydet(); 
        puanEkle(0.5); // Her alev için +0.5 XP
        
        const buton = document.getElementById(`alev-sayi-${konuId}`).closest('.etkilesim-btn');
        if (buton) {
            buton.style.opacity = "0.5";
            buton.style.cursor = "not-allowed";
        }
    }
}

function yorumEkle(konuId) {
    if (aktifRumuz === "") { alert("Şef, yorum atmak için profilden rumuz alman lazım!"); return; }

    const input = document.getElementById(`yorum-input-${konuId}`);
    if (!input) return; 
    
    const metin = input.value.trim();
    if (metin === "") return;

    // Gelişmiş Spam Koruması
    const ayniHarfSpami = /([a-zA-ZçğıöşüÇĞİÖŞÜ])\1{4,}/i.test(metin);
    const rastgeleSpam = /[bcçdfgğhjklmnprsştvyzBCÇDFGĞHJKLMNPRSŞTVYZ]{6,}/i.test(metin);
    
    if (ayniHarfSpami || rastgeleSpam) {
        alert("İş arama stresi klavyeye yansımış gibi şef! 😅 Bize ne hissettiğini kelimelerle anlat ki destek olabilelim.");
        input.value = ""; 
        return; 
    }

    const konu = tumKonular.find(k => k.id === konuId);
    if (konu) {
        const anlikSaat = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        if (!konu.yorumlar) { konu.yorumlar = []; }

        // Hafızaya ekleme
        konu.yorumlar.push({ yazar: aktifRumuz, metin: metin, tarih: anlikSaat });
        verileriKaydet(); 
        
        // Arayüze anlık basma (🔥 XSS Kalkanı `metniGuvenliYap` entegre edildi!)
        const listeDiv = document.getElementById(`yorum-listesi-${konuId}`);
        const sayacSpan = document.getElementById(`yorum-sayac-${konuId}`);
        
        if (listeDiv) {
            const guvenliYorum = metniGuvenliYap(metin);
            const guvenliYazar = metniGuvenliYap(aktifRumuz);
            const yeniYorumHTML = `<div class="tek-yorum"><span class="yorum-tarih">[${anlikSaat}]</span> <b>${guvenliYazar}:</b> ${guvenliYorum}</div>`;
            listeDiv.insertAdjacentHTML('beforeend', yeniYorumHTML);
            listeDiv.scrollTop = listeDiv.scrollHeight; 
        }
        
        if (sayacSpan) {
            sayacSpan.innerText = `${konu.yorumlar.length} Yorum`;
        }
        
        input.value = "";
        puanEkle(0.1); // Yorum başına +0.1 XP
        toplamYorumSayisi++;
        
        const profilYorumSpan = document.getElementById('profil-sayac-yorum');
        if (profilYorumSpan) profilYorumSpan.innerText = toplamYorumSayisi;
    }
}

function toggleYorumKutusu(id) {
    const kutu = document.getElementById(`yorum-kutusu-${id}`);
    if (!kutu) return;

    if (kutu.style.getPropertyValue('display') === 'none !important' || kutu.style.display === 'none') {
        // Kutuyu açarken bizim CSS'teki Flex yapısını koruyarak açıyoruz
        kutu.style.setProperty('display', 'flex', 'important');
    } else {
        // Kapatırken güvenli şekilde gizliyoruz
        kutu.style.setProperty('display', 'none', 'important');
    }
}

function filtreUygula(kategori, btnElement) {
    document.querySelectorAll('.filtre-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    konulariEkranaBas(kategori);
}

function konuSil(konuId) {
    if (!confirm("Bu paylaşımı silmek istediğine emin misin şef? Geri dönüşü yok!")) return;

    tumKonular = tumKonular.filter(k => k.id !== konuId);
    verileriKaydet(); 
    
    konulariEkranaBas(guncelFiltre);
    anaSayfaSayaclariniGuncelle();
    alert("Paylaşım silindi.");
}

// SİBER GÜVENLİK KALKANI: HTML Injection (XSS) Engelleme Fonksiyonu
function metniGuvenliYap(metin) {
    if (!metin) return "";
    const div = document.createElement('div');
    div.innerText = metin; 
    return div.innerHTML;
}
