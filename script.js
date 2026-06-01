// ========================================================
// İŞSİZİM.COM - PUAN SİSTEMLİ VE SPAM KORUMALI MOTOR
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
    'ekmek': 'Ekmekle Oynama',
    'hak': 'Hakkını Verenler',
    'insan': 'İnsan Odaklılar'
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

// --- ORTAK KAYIT MOTORU (Sorunu çözen kısım burası) ---
function verileriKaydet() {
    // Tüm listeleri metin haline getirip hafızaya gömüyoruz
    localStorage.setItem('tum_konular', JSON.stringify(tumKonular));
    localStorage.setItem('issizim_alevler', JSON.stringify(alevAtilanlar));
}

// --- SAYFA AÇILIŞI (DÜZELTİLMİŞ) ---
window.onload = function() {
    const kayıtlıRumuz = localStorage.getItem('issizim_rumuz');
    const kayıtlıPuan = localStorage.getItem('issizim_puan');
    const kaydedilmisKonular = localStorage.getItem('tum_konular');
    const kaydedilmisAlevler = localStorage.getItem('issizim_alevler');

    if (kayıtlıRumuz) aktifRumuz = kayıtlıRumuz;
    if (kayıtlıPuan) kullaniciPuan = parseFloat(kayıtlıPuan) || 0;
    
    // HATAYI BURADA DÜZELTTİK: değişken adı "kaydedilmisKonular" olmalı
    if (kaydedilmisKonular) {
        tumKonular = JSON.parse(kaydedilmisKonular);
    }
    
    if (kaydedilmisAlevler) {
        alevAtilanlar = JSON.parse(kaydedilmisAlevler);
    }

    const input = document.getElementById('profil-rumuz-input');
    if(input && aktifRumuz) input.value = aktifRumuz;

    anaSayfaSayaclariniGuncelle();
    konulariEkranaBas(); 
    
    try {
        puanEkle(0); 
    } catch (e) {
        console.log("Rütbe hesaplama hatası:", e);
    }
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
    localStorage.setItem('issizim_puan', kullaniciPuan);
    const rutbe = rutbeHesapla(kullaniciPuan); // rütbeni hesaplıyorsun
    
    // Profil ekranındaki elementler
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

    // Dashboard ve Konular ekranındaki rütbeleri güncelle
    const kisaRutbe = document.getElementById('kisa-rutbe-adi'); 
    const konularRutbe = document.getElementById('konular-rutbe-adi'); 

    if(kisaRutbe) kisaRutbe.innerText = rutbe.ad;
    if(konularRutbe) konularRutbe.innerText = rutbe.ad;
    if (dashR) dashR.innerText = rutbe.ad;
    if (konuR) konuR.innerText = rutbe.ad;
}

// --- SAYAÇ MOTORU ---
function anaSayfaSayaclariniGuncelle() {
    const kategoriler = ['zaman', 'itaat', 'mulakat', 'vaat', 'ekmek'];
    kategoriler.forEach(kat => {
        const sayacSpan = document.getElementById(`sayac-${kat}`);
        if (sayacSpan) sayacSpan.innerText = tumKonular.filter(k => k.kategori === kat).length;
    });

    const profilKonuSpan = document.getElementById('profil-sayac-konu');
    if (profilKonuSpan && aktifRumuz !== "") {
        profilKonuSpan.innerText = tumKonular.filter(k => k.yazar === aktifRumuz).length;
    }
}

// --- SAYFA GEÇİŞLERİ ---
function ekranDegistir(ekranId) {
    document.querySelectorAll('.proje-ekran').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`ekran-${ekranId}`).style.display = 'block';
    document.getElementById(`nav-${ekranId}`).classList.add('active');
    
    if(ekranId === 'konular') konulariEkranaBas(guncelFiltre);
}

function rumuzKaydet() {
    const input = document.getElementById('profil-rumuz-input');
    const yeniRumuz = input.value.trim();
    
    const sonDegisim = localStorage.getItem('son_rumuz_degisim');
    const simdi = new Date().getTime();
    const birAy = 30 * 24 * 60 * 60 * 1000;

    if (sonDegisim && (simdi - sonDegisim < birAy)) {
        alert("Şef, rumuzunu sadece ayda bir kere değiştirebilirsin. Biraz bekle!");
        return;
    }

    if(yeniRumuz === "") { alert("Boş bırakma şef!"); return; }
    if(yeniRumuz === aktifRumuz) return;

    tumKonular.forEach(konu => {
        if (konu.yazar === aktifRumuz) konu.yazar = yeniRumuz;
        konu.yorumlar.forEach(yorum => {
            if (yorum.yazar === aktifRumuz) yorum.yazar = yeniRumuz;
        });
    });

    aktifRumuz = yeniRumuz;
    localStorage.setItem('issizim_rumuz', aktifRumuz);
    localStorage.setItem('son_rumuz_degisim', simdi);
    
    verileriKaydet(); // Değişiklikleri hafızaya yaz
    alert("Rumuz güncellendi! Eski isyanların ve puanın yeni rumuzuna taşındı şef.");
    anaSayfaSayaclariniGuncelle();
    konulariEkranaBas(guncelFiltre);
}

// --- YENİ KONU GÖNDERME ---
function konuGonder() {
    if (aktifRumuz === "") { alert("Önce profilden rumuz al şef!"); ekranDegistir('profil'); return; }
    
    const icerikAlani = document.getElementById('konu-icerik');
    const metin = icerikAlani.value.trim();
    if (metin === "") { alert("Boş gönderemezsin!"); return; }

    const yeniKonu = {
        id: Date.now(),
        yazar: aktifRumuz,
        kategori: document.getElementById('kategori-secim').value,
        metin: metin,
        alevSayisi: 0,
        yorumlar: []
    };

    tumKonular.unshift(yeniKonu);
    verileriKaydet(); // Hafızaya anında yazıyoruz!
    
    icerikAlani.value = "";
    puanEkle(5); 
    anaSayfaSayaclariniGuncelle();
    
    alert("İsyanın sığınağa ulaştı! +5 XP Kazandın.");
    ekranDegistir('konular');
}

// --- AKILLI RENDER ---
function konulariEkranaBas(filtre = "tumu") {
    guncelFiltre = filtre;
    const akisKutusu = document.getElementById('konular-akisi');
    if (!akisKutusu) return;
    akisKutusu.innerHTML = ""; 

    // RENKLERİ BURADA TANIMLIYORUZ (Sıkıntı çıkmaması için burada kalsın)
    const kategoriRenkleri = {
        'zaman': '#ff4d4d',      // Kırmızı (Şikayet)
        'mulakat': '#e67e22',    // Turuncu
        'itaat': '#3498db',      // Mavi
        'vaat': '#9b59b6',       // Mor
        'ekmek': '#e74c3c',      // Kırmızı
        'hak': '#2ecc71',        // Yeşil (Pozitif)
        'insan': '#2ecc71'       // Yeşil (Pozitif)
    };

    tumKonular.forEach(konu => {
        if (filtre !== "tumu" && konu.kategori !== filtre) return;

        // Kategori rengini seç, yoksa varsayılan mavi olsun
        const renk = kategoriRenkleri[konu.kategori] || '#3498db';
        
        let yorumlarHTML = konu.yorumlar.map(y => `<div class="tek-yorum"><b>${y.yazar}:</b> ${y.metin}</div>`).join('');

        const kartHTML = `
            <div class="konu-karti" id="kart-${konu.id}">
                <div class="konu-ust-bar">
                    <span class="konu-yazar">${konu.yazar}</span>
                    <span class="rutbe-badge">${konu.rutbe || 'Gözlemci'}</span>
                    
                    <span class="konu-badge" style="background:${renk}; margin-left: auto;">
    ${kategoriIsimleri[konu.kategori] || 'Genel'}
</span>
                    ${konu.yazar === aktifRumuz ? `<button class="sil-btn" onclick="konuSil(${konu.id})">🗑️</button>` : ''}
                </div>
                
                <p id="metin-alan-${konu.id}" class="konu-metni" style="max-height: 200px; overflow-y: auto; padding-right: 5px;">${konu.metin}</p>
                
                <div class="konu-alt-bar">
                    <button class="etkilesim-btn alev-btn" onclick="alevAt(${konu.id})">🔥 <span id="alev-sayi-${konu.id}">${konu.alevSayisi}</span></button>
                    <button class="etkilesim-btn" onclick="toggleYorumKutusu(${konu.id})">💬 <span id="yorum-sayac-${konu.id}">${konu.yorumlar.length} Yorum</span></button>
                </div>
                
                <div id="yorum-kutusu-${konu.id}" class="yorumlar-alani" style="display: none;">
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

// --- İŞLEMLER VE SPAM FİLTRESİ ---
function alevAt(konuId) {
    if (alevAtilanlar.includes(konuId)) { alert("Zaten alev attın şef! 🔥"); return; }

    const konu = tumKonular.find(k => k.id === konuId);
    if (konu) {
        konu.alevSayisi++;
        document.getElementById(`alev-sayi-${konuId}`).innerText = konu.alevSayisi;
        alevAtilanlar.push(konuId);
        
        verileriKaydet(); // Alev atılınca hafızaya yaz!
        puanEkle(0.5); 
        
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
    const metin = input.value.trim();
    if (metin === "") return;

    const ayniHarfSpami = /([a-zA-ZçğıöşüÇĞİÖŞÜ])\1{4,}/i.test(metin);
    const rastgeleSpam = /[bcçdfgğhjklmnprsştvyzBCÇDFGĞHJKLMNPRSŞTVYZ]{6,}/i.test(metin);
    
    if (ayniHarfSpami || rastgeleSpam) {
        alert("İş arama stresi klavyeye yansımış gibi şef! 😅 Bize ne hissettiğini kelimelerle anlat ki destek olabilelim.");
        input.value = ""; 
        return; 
    }

    const konu = tumKonular.find(k => k.id === konuId);
    if (konu) {
        konu.yorumlar.push({ yazar: aktifRumuz, metin: metin });
        
        verileriKaydet(); // Yorum atılınca hafızaya yaz!
        
        const yeniYorumHTML = `<div class="tek-yorum"><b>${aktifRumuz}:</b> ${metin}</div>`;
        document.getElementById(`yorum-listesi-${konuId}`).insertAdjacentHTML('beforeend', yeniYorumHTML);
        document.getElementById(`yorum-sayac-${konuId}`).innerText = `${konu.yorumlar.length} Yorum`;
        
        input.value = "";
        
        const listeDiv = document.getElementById(`yorum-listesi-${konuId}`);
        listeDiv.scrollTop = listeDiv.scrollHeight; 

        puanEkle(0.1); 
        toplamYorumSayisi++;
        const profilYorumSpan = document.getElementById('profil-sayac-yorum');
        if(profilYorumSpan) profilYorumSpan.innerText = toplamYorumSayisi;
    }
}

function toggleYorumKutusu(konuId) {
    const kutu = document.getElementById(`yorum-kutusu-${konuId}`);
    kutu.style.display = (kutu.style.display === 'none' || kutu.style.display === '') ? 'block' : 'none';
}

function filtreUygula(kategori, btnElement) {
    document.querySelectorAll('.filtre-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    konulariEkranaBas(kategori);
}

function konuSil(konuId) {
    if (!confirm("Bu isyanı silmek istediğine emin misin şef? Geri dönüşü yok!")) return;

    tumKonular = tumKonular.filter(k => k.id !== konuId);
    
    verileriKaydet(); // Konu silinince hafızaya yaz!
    
    konulariEkranaBas(guncelFiltre);
    anaSayfaSayaclariniGuncelle();
    alert("İsyan temizlendi.");
}
