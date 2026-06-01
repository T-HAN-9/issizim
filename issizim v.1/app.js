var kullaniciRumuz = '';
var kullaniciHakkimda = 'Meydanda yeni bir geliştirici...';
var acikKonular = []; 
var acikProjeler = [];
var kullaniciTepkiHafizasi = {};

var ortakAktiviteAkisi = [
    { tür: 'konu', yazar: '@T-HAN', baslik: "Türkiye’de teknoloji sektörünün özeti", link: 'konular', tarih: 'Bugün 14:20' }
];

var konularVeriTabani = [
    {
        id: 1,
        yazar: "@T-HAN",
        baslik: "Türkiye’de teknoloji sektörünün özeti: {şirket}",
        icerik: "Yazılım öğrenmek için başvurduğun yerden gelen otomatik mailde bile placeholder unutan hantal yapılar... :D",
        tarihMetni: "Bugün 14:20",
        fotograflar: [],
        tepkiler: { like: 12, dislike: 1, gülme: 8, alev: 15, roket: 9 },
        yorumlar: [
            { yazar: "@Anonim", icerik: "Harbi trajikomik şef, patladım hshaha", tarihMetni: "Bugün 14:35" }
        ]
    }
];

var projelerVeriTabani = [
    {
        id: 1,
        yazar: "@T-HAN",
        adi: "İşsizim Platformu",
        durum: "Yapım Aşamasında",
        fikir: "Kariyer platformlarının yapay kasıntılığını yıkan yerli veri meydanı.",
        fotograflar: [],
        tepkiler: { like: 24, dislike: 0 },
        yorumlar: []
    }
];

function canliKullaniciGuncelle() {
    var num = Math.floor(Math.random() * 25) + 35;
    var el = document.getElementById('aktif-sayi');
    if (el) el.innerText = "Meydanda: " + num + " kişi";
}

function suAnkiZamaniGetir() {
    var simdi = new Date();
    var saat = String(simdi.getHours()).padStart(2, '0');
    var dakika = String(simdi.getMinutes()).padStart(2, '0');
    return `Bugün ${saat}:${dakika}`;
}

function girisYap() {
    var inputKutusu = document.getElementById('reg-rumuz');
    var modalKatmani = document.getElementById('modal-layer');
    var anaEkranKatmani = document.getElementById('ana-ekran');
    var hamRumuz = inputKutusu.value.trim();

    if (hamRumuz === "") {
        alert("Lütfen sistem için bir rumuz belirleyin!");
        return;
    }

    kullaniciRumuz = hamRumuz.startsWith('@') ? hamRumuz : '@' + hamRumuz;
    modalKatmani.style.display = 'none';
    anaEkranKatmani.style.display = 'block';

    anaEkranKatmani.innerHTML = `
        <nav class="navbar">
            <div class="nav-sol">
                <h1 onclick="sekmeDegistir('ana-sayfa')">İŞSİZİM</h1>
                <div class="canli-sayac">
                    <span class="yesil-nokta"></span>
                    <span id="aktif-sayi">Meydanda: -- kişi</span>
                </div>
            </div>
            <div class="nav-links">
                <button id="btn-ana-sayfa" class="nav-btn" onclick="sekmeDegistir('ana-sayfa')">Ana Sayfa</button>
                <button id="btn-konular" class="nav-btn" onclick="sekmeDegistir('konular')">Konular</button>
                <button id="btn-projem-var" class="nav-btn" onclick="sekmeDegistir('projem-var')">Projem Var</button>
                <button id="btn-profilim" class="nav-btn" onclick="sekmeDegistir('profilim')">Profilim</button>
            </div>
        </nav>
        <div id="meydan-ana-konteyner"></div>
    `;

    canliKullaniciGuncelle();
    sekmeDegistir('ana-sayfa'); 
}

function sekmeDegistir(sekmeAdi) {
    var butonlar = document.querySelectorAll('.nav-links button');
    butonlar.forEach(btn => btn.classList.remove('aktif'));
    var aktifButon = document.getElementById('btn-' + sekmeAdi);
    if(aktifButon) aktifButon.classList.add('aktif');

    var konteyner = document.getElementById('meydan-ana-konteyner');
    if(!konteyner) return;
    
    if (sekmeAdi === 'ana-sayfa') {
        konteyner.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-sol-kolon">
                    <div class="anket-kart" id="anket-alani">
                        <div class="yk-etiket">Günün Dopamin Anketi 📊</div>
                        <h3>Bugün mülakata girsen elenmekten korkar mısın?</h3>
                        <div class="anket-butonlar">
                            <button onclick="oyVer(74, 26, 'g')" class="anket-btn-oy">Evet, Biraz Gerginim 😔</button>
                            <button onclick="oyVer(26, 74, 'r')" class="anket-btn-oy">Hayır, Modum Yüksek 😎</button>
                        </div>
                    </div>

                    <div class="anket-kart" id="anket-alani-2">
                        <div class="yk-etiket">Günün Veri Anketi 📊</div>
                        <h3>Çalıştığın yerde sana mobbing uygulanıyor mu?</h3>
                        <div class="anket-butonlar">
                            <button onclick="oyVerMobbing(82, 18, 'm')" class="anket-btn-oy">Evet, Sürekli hatalarım aranıyor 😔</button>
                            <button onclick="oyVerMobbing(18, 82, 'k')" class="anket-btn-oy">Hayır, Keyfim yerinde 😎</button>
                        </div>
                    </div>
                </div>
                
                <div class="aktivite-panel">
                    <div class="yk-etiket">Meydanda Neler Oluyor? ⚡</div>
                    <div class="aktivite-liste" id="canli-aktivite-akisi"></div>
                </div>
                <div class="iletisim-kutu">
    <p>Bu platform bir başlangıç. Vizyonum; iş arama süreçlerini daha samimi ve üretken bir hale getirmek. 
    Eğer sen de bir yazılımcı veya geliştiriciysen ve bu yapıyı beraber ileriye taşımak istersen, bana ulaşabilirsin.</p><br>
    <p><strong>İletişim:</strong> tunahan.1776@outlook.com</p>
</div>
                </div>
            </div>
        
        `;
        aktiviteAkisiniGuncelle();
    } 
    else if (sekmeAdi === 'konular') {
        konteyner.innerHTML = `
            <div class="tek-kolon-duzen">
                <button class="giris-btn" style="border-radius:12px; margin-bottom:20px;" onclick="formGosterGizle('konu-ac-formu')">+ MEYDANDA KONU AÇ</button>
                
                <div id="konu-ac-formu" class="anket-kart form-pencereleri" style="display:none;">
                    <div class="yk-etiket">Yeni Konu Bırak (Maks. 3 Fotoğraf) 🎯</div>
                    <input type="text" id="konu-baslik" class="meydan-input" placeholder="Konu Başlığı nedir şef?">
                    <textarea id="konu-anlat" class="meydan-input" style="height:100px; text-align:left;" placeholder="Mevzuyu anlat, verileri dök..."></textarea>
                    
                    <div class="foto-yukleme-alani">
                        <label for="foto-secici-konu" class="nav-btn-sari" style="display:inline-block; cursor:pointer; margin-bottom:10px;">📸 Fotoğrafları Seç</label>
                        <input type="file" id="foto-secici-konu" multiple accept="image/*" style="display:none;" onchange="fotograflariOnizle('foto-secici-konu', 'onizleme-konu')">
                        <div id="onizleme-konu" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:15px;"></div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <button class="giris-btn" onclick="konuPaylas()">PAYLAŞ</button>
                        <button class="iptal-btn" onclick="formGosterGizle('konu-ac-formu')">İPTAL</button>
                    </div>
                </div>
                <div id="konular-listesi"></div>
            </div>
        `;
        konulariListele();
    }
    else if (sekmeAdi === 'projem-var') {
        konteyner.innerHTML = `
            <div class="tek-kolon-duzen">
                <button class="giris-btn" style="border-radius:12px; margin-bottom:20px;" onclick="formGosterGizle('proje-ac-formu')">🚀 YENİ PROJE PAYLAŞ</button>
                
                <div id="proje-ac-formu" class="anket-kart form-pencereleri" style="display:none;">
                    <div class="yk-etiket">Proje Tanıtım Paneli (Maks. 3 Fotoğraf) 🛠️</div>
                    <input type="text" id="proje-adi" class="meydan-input" placeholder="Projenin Adı nedir?">
                    
                    <select id="proje-durum" class="meydan-input-select">
                        <option value="Fikir Aşamasında">💡 Fikir Aşamasında</option>
                        <option value="Yapım Aşamasında">🛠️ Yapım Aşamasında</option>
                    </select>

                    <textarea id="proje-fikir" class="meydan-input" style="height:100px; text-align:left;" placeholder="Projenin amacı..."></textarea>
                    
                    <div class="foto-yukleme-alani">
                        <label for="foto-secici-proje" class="nav-btn-sari" style="display:inline-block; cursor:pointer; margin-bottom:10px;">📸 Ekran Görüntüleri Seç</label>
                        <input type="file" id="foto-secici-proje" multiple accept="image/*" style="display:none;" onchange="fotograflariOnizle('foto-secici-proje', 'onizleme-proje')">
                        <div id="onizleme-proje" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:15px;"></div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <button class="giris-btn" onclick="projePaylas()">PROJEYİ EKLE</button>
                        <button class="iptal-btn" onclick="formGosterGizle('proje-ac-formu')">İPTAL</button>
                    </div>
                </div>
                <div id="projeler-listesi"></div>
            </div>
        `;
        projeleriListele();
    }
    else if (sekmeAdi === 'profilim') {
        var kendiKonuSayisi = konularVeriTabani.filter(k => k.yazar === kullaniciRumuz).length;
        var kendiProjeSayisi = projelerVeriTabani.filter(p => p.yazar === kullaniciRumuz).length;

        konteyner.innerHTML = `
            <div class="dashboard-grid" style="max-width:900px; grid-template-columns: 1.2fr 1fr;">
                <div class="profil-sol-kart">
                    <div class="profil-avatar">${kullaniciRumuz.substring(1,3).toUpperCase()}</div>
                    <h2 style="color:#ffcc00; margin-bottom:5px;">${kullaniciRumuz}</h2>
                    <div class="version-badge" style="background:#222; color:#ffcc00; border-color:#ffcc00;">Geliştirici Üye</div>
                    
                    <div class="hakkimda-kapsayici">
                        <label style="font-size:11px; color:#ffcc00; display:block; margin-bottom:5px; font-weight:bold;">HAKKIMDA</label>
                        <p id="hakkimda-metni">${kullaniciHakkimda}</p>
                        <textarea id="hakkimda-input" class="meydan-input" style="display:none; height:80px; text-align:left;">${kullaniciHakkimda}</textarea>
                        <button id="hakkimda-btn" class="nav-btn-sari" style="margin-top:10px; width:100%;" onclick="hakkimdaDuzenle()">Hakkımda Düzenle</button>
                    </div>

                    <div class="profil-istatistik">
                        <div><b>${kendiKonuSayisi}</b><span>Konu</span></div>
                        <div><b>${kendiProjeSayisi}</b><span>Proje</span></div>
                    </div>
                </div>

                <div class="profil-sag-akis">
                    <div class="yk-etiket" style="margin-bottom:15px;">Meydandaki İzlerin 🐾</div>
                    <div id="profil-kendi-akisi" class="profil-scroll-alani"></div>
                </div>
            </div>
        `;
        profilAkisiniYukle();
    }
}

function formGosterGizle(id) {
    var f = document.getElementById(id);
    if(f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

var yuklenenFotolarBase64 = [];
function fotograflariOnizle(seciciId, onizlemeId) {
    var secici = document.getElementById(seciciId);
    var onizlemeAlani = document.getElementById(onizlemeId);
    if(!secici || !onizlemeAlani) return;
    onizlemeAlani.innerHTML = '';
    yuklenenFotolarBase64 = [];

    if (secici.files) {
        var dosyalar = [...secici.files].slice(0, 3);
        if([...secici.files].length > 3) {
            alert("Şef galeri sınırımız 3 fotoğraftır. İlk 3 fotoğraf işleme alındı! 😉");
        }
        
        dosyalar.forEach(file => {
            var reader = new FileReader();
            reader.onload = function (e) {
                yuklenenFotolarBase64.push(e.target.result);
                var img = document.createElement('img');
                img.src = e.target.result;
                img.className = "onizleme-kucuk-resim";
                onizlemeAlani.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    }
}

function reaksiyonIsle(id, tip, veriTabani, anahtarOnEki) {
    var kayitId = `${anahtarOnEki}_${id}`;
    var eskiSecim = kullaniciTepkiHafizasi[kayitId];
    var hedefPost = veriTabani.find(item => item.id === id);
    if (!hedefPost) return;

    if (eskiSecim === tip) {
        hedefPost.tepkiler[tip]--;
        delete kullaniciTepkiHafizasi[kayitId];
    } else {
        if (eskiSecim) {
            hedefPost.tepkiler[eskiSecim]--;
        }
        hedefPost.tepkiler[tip]++;
        kullaniciTepkiHafizasi[kayitId] = tip;
    }
}

function tepkiVerKonu(id, tip) {
    reaksiyonIsle(id, tip, konularVeriTabani, 'konu');
    konulariListele();
}

function tepkiVerProje(id, tip) {
    reaksiyonIsle(id, tip, projelerVeriTabani, 'proje');
    projeleriListele();
}

function aktifEmoSinifi(id, tip, anahtarOnEki) {
    return kullaniciTepkiHafizasi[`${anahtarOnEki}_${id}`] === tip ? 'secili-emo' : '';
}

function konuPaylas() {
    var baslikEl = document.getElementById('konu-baslik');
    var anlatEl = document.getElementById('konu-anlat');
    if(!baslikEl || !anlatEl) return;

    var baslik = baslikEl.value.trim();
    var anlat = anlatEl.value.trim();
    var zaman = suAnkiZamaniGetir();

    if(!baslik || !anlat) {
        alert("Başlık ve alanları boş geçme şef!");
        return;
    }

    var yeniKonu = {
        id: konularVeriTabani.length + 1,
        yazar: kullaniciRumuz,
        baslik: baslik,
        icerik: anlat,
        tarihMetni: zaman,
        fotograflar: [...yuklenenFotolarBase64],
        tepkiler: { like: 0, dislike: 0, gülme: 0, alev: 0, roket: 0 },
        yorumlar: []
    };

    konularVeriTabani.unshift(yeniKonu); 
    ortakAktiviteAkisiniBesle('konu', kullaniciRumuz, baslik, 'konular', zaman);
    yuklenenFotolarBase64 = []; 
    sekmeDegistir('konular'); 
}

function devaminiGor(btn, uniqueId) {
    var icerikKutusu = document.getElementById(uniqueId);
    if(!icerikKutusu) return;
    if (icerikKutusu.classList.contains('limitli-metin')) {
        icerikKutusu.classList.remove('limitli-metin');
        icerikKutusu.classList.add('tam-metin');
        btn.innerText = "Daha Az Göster ▲";
    } else {
        icerikKutusu.classList.remove('tam-metin');
        icerikKutusu.classList.add('limitli-metin');
        btn.innerText = "Devamını Gör ▼";
    }
}

function konulariListele(aktifOdakID) {
    var listeAlani = document.getElementById('konular-listesi');
    if(!listeAlani) return;
    listeAlani.innerHTML = '';

    konularVeriTabani.forEach(konu => {
        var fotoHtml = '';
        if(konu.fotograflar && konu.fotograflar.length > 0) {
            fotoHtml = `<div class="coklu-gorsel-galeri">`;
            konu.fotograflar.forEach(f => {
                fotoHtml += `<img src="${f}" class="meydan-post-gorsel" onclick="lightboxAc('${f}')">`;
            });
            fotoHtml += `</div>`;
        }

        var yorumlarHtml = '';
        konu.yorumlar.forEach(yr => {
            yorumlarHtml += `
                <div class="yorum-item">
                    <span style="color:#ffcc00; font-weight:bold;">${yr.yazar}</span> 
                    <span style="color:#666; font-size:11px; margin-left:8px;">${yr.tarihMetni}</span>
                    <p style="color:#ccc; font-size:13px; margin-top:3px; white-space:pre-wrap;">${yr.icerik}</p>
                </div>
            `;
        });

        var acikMi = acikKonular.includes(konu.id);
        var displayStili = acikMi ? 'block' : 'none';
        var butonMetni = acikMi ? `▲ Yorumları Gizle (${konu.yorumlar.length})` : `▼ Yorumları Göster (${konu.yorumlar.length})`;

        var kart = document.createElement('div');
        kart.className = 'anket-kart';
        kart.style.textAlign = 'left';
        
        var uID = `konu-text-${konu.id}`;
        var uzunMetinMi = konu.icerik.length > 250;
        var metinGövdeHtml = uzunMetinMi 
            ? `<div id="${uID}" class="limitli-metin">${konu.icerik}</div>
               <button class="devam-btn" onclick="devaminiGor(this, '${uID}')">Devamını Gör ▼</button>`
            : `<div class="tam-metin">${konu.icerik}</div>`;

        kart.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="color:#ffcc00; font-weight:bold; font-size:14px;">${konu.yazar}</span>
                <span style="color:#555; font-size:12px; font-weight:bold;">🕒 ${konu.tarihMetni}</span>
            </div>
            <h3 style="color:#fff; font-size:17px; margin-bottom:8px;">${konu.baslik}</h3>
            
            ${metinGövdeHtml}
            ${fotoHtml}
            
            <div class="tepki-satiri-kapsayici">
                <button class="tepki-emo-btn ${aktifEmoSinifi(konu.id, 'like', 'konu')}" onclick="tepkiVerKonu(${konu.id}, 'like')">👍 <span>${konu.tepkiler.like}</span></button>
                <button class="tepki-emo-btn ${aktifEmoSinifi(konu.id, 'dislike', 'konu')}" onclick="tepkiVerKonu(${konu.id}, 'dislike')">👎 <span>${konu.tepkiler.dislike}</span></button>
                <button class="tepki-emo-btn ${aktifEmoSinifi(konu.id, 'gülme', 'konu')}" onclick="tepkiVerKonu(${konu.id}, 'gülme')">😂 <span>${konu.tepkiler.gülme}</span></button>
                <button class="tepki-emo-btn ${aktifEmoSinifi(konu.id, 'alev', 'konu')}" onclick="tepkiVerKonu(${konu.id}, 'alev')">🔥 <span>${konu.tepkiler.alev}</span></button>
                <button class="tepki-emo-btn ${aktifEmoSinifi(konu.id, 'roket', 'konu')}" onclick="tepkiVerKonu(${konu.id}, 'roket')">🚀 <span>${konu.tepkiler.roket}</span></button>
            </div>

            <div style="margin-top: 15px; text-align: right;">
                <button class="nav-btn-sari" style="font-size:12px; padding: 5px 12px;" onclick="yorumToggleKonu(${konu.id})">
                    ${butonMetni}
                </button>
            </div>
            
            <div id="yorum-sekmesi-${konu.id}" class="yorum-sekmesi" style="display:${displayStili};">
                <hr style="border:0; border-top:1px solid #222; margin:15px 0;">
                <div class="yorum-kaydirma-kutusu" id="yorum-listesi-${konu.id}">${yorumlarHtml}</div>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <input type="text" id="yorum-input-${konu.id}" class="meydan-input" style="margin-bottom:0; padding:8px;" placeholder="Yorumunu bırak şef..." onkeydown="if(event.key === 'Enter') yorumYapKonu(${konu.id})">
                    <button class="giris-btn" style="width:auto; padding:0 20px; border-radius:12px;" onclick="yorumYapKonu(${konu.id})">Gönder</button>
                </div>
            </div>
        `;
        listeAlani.appendChild(kart);
    });

    if (aktifOdakID) {
        var inputElement = document.getElementById(`yorum-input-${aktifOdakID}`);
        if (inputElement) inputElement.focus();
    }
}

function yorumToggleKonu(id) {
    var idx = acikKonular.indexOf(id);
    if (idx === -1) acikKonular.push(id); else acikKonular.splice(idx, 1);
    konulariListele();
}

function yorumYapKonu(konuId) {
    var input = document.getElementById(`yorum-input-${konuId}`);
    if(!input) return;
    var icerik = input.value.trim();
    if(!icerik) return;

    var konu = konularVeriTabani.find(k => k.id === konuId);
    if(konu) {
        konu.yorumlar.push({ yazar: kullaniciRumuz, icerik: icerik, tarihMetni: suAnkiZamaniGetir() });
        if(!acikKonular.includes(konuId)) acikKonular.push(konuId);
        konulariListele(konuId);
        var k = document.getElementById(`yorum-listesi-${konuId}`);
        if(k) k.scrollTop = k.scrollHeight;
    }
}

function projePaylas() {
    var adiEl = document.getElementById('proje-adi');
    var durumEl = document.getElementById('proje-durum');
    var fikirEl = document.getElementById('proje-fikir');
    if(!adiEl || !durumEl || !fikirEl) return;

    var adi = adiEl.value.trim();
    var durum = durumEl.value;
    var fikir = fikirEl.value.trim();
    var zaman = suAnkiZamaniGetir();

    if(!adi || !fikir) {
        alert("Proje adı ve açıklama alanını boş bırakma şef!");
        return;
    }

    var yeniProje = {
        id: projelerVeriTabani.length + 1,
        yazar: kullaniciRumuz,
        adi: adi,
        durum: durum,
        fikir: fikir,
        fotograflar: [...yuklenenFotolarBase64],
        tepkiler: { like: 0, dislike: 0 }, 
        yorumlar: []
    };

    projelerVeriTabani.unshift(yeniProje);
    ortakAktiviteAkisiniBesle('proje', kullaniciRumuz, adi, 'projem-var', zaman);
    yuklenenFotolarBase64 = [];
    sekmeDegistir('projem-var');
}

function projeleriListele(aktifOdakID) {
    var listeAlani = document.getElementById('projeler-listesi');
    if(!listeAlani) return;
    listeAlani.innerHTML = '';

    projelerVeriTabani.forEach(proje => {
        var fotoHtml = '';
        if(proje.fotograflar && proje.fotograflar.length > 0) {
            fotoHtml = `<div class="coklu-gorsel-galeri">`;
            proje.fotograflar.forEach(f => {
                fotoHtml += `<img src="${f}" class="meydan-post-gorsel" onclick="lightboxAc('${f}')">`;
            });
            fotoHtml += `</div>`;
        }

        var yorumlarHtml = '';
        proje.yorumlar.forEach(yr => {
            yorumlarHtml += `
                <div class="yorum-item">
                    <span style="color:#ffcc00; font-weight:bold;">${yr.yazar}</span> 
                    <span style="color:#666; font-size:11px; margin-left:8px;">${yr.tarihMetni}</span>
                    <p style="color:#ccc; font-size:13px; margin-top:3px; white-space:pre-wrap;">${yr.icerik}</p>
                </div>
            `;
        });

        var acikMi = acikProjeler.includes(proje.id);
        var displayStili = acikMi ? 'block' : 'none';
        var butonMetni = acikMi ? `▲ Yorumları Gizle (${proje.yorumlar.length})` : `▼ Yorumları Göster (${proje.yorumlar.length})`;
        var durumEtiketSinifi = proje.durum === 'Fikir Aşamasında' ? 'badge-fikir' : 'badge-yapim';

        var kart = document.createElement('div');
        kart.className = 'anket-kart';
        kart.style.textAlign = 'left';

        var uID = `proje-text-${proje.id}`;
        var uzunMetinMi = proje.fikir.length > 250;
        var metinGövdeHtml = uzunMetinMi 
            ? `<div id="${uID}" class="limitli-metin">${proje.fikir}</div>
               <button class="devam-btn" onclick="devaminiGor(this, '${uID}')">Devamını Gör ▼</button>`
            : `<div class="tam-metin">${proje.fikir}</div>`;

        kart.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="color:#ffcc00; font-weight:bold; font-size:14px;">${proje.yazar}</span>
                <span class="proje-durum-badge ${durumEtiketSinifi}">${proje.durum}</span>
            </div>
            <h3 style="color:#fff; font-size:18px; margin-bottom:8px; border-bottom:1px dashed #222; padding-bottom:5px;">🚀 ${proje.adi}</h3>
            
            ${metinGövdeHtml}
            ${fotoHtml}
            
            <div class="tepki-satiri-kapsayici">
                <button class="tepki-emo-btn ${aktifEmoSinifi(proje.id, 'like', 'proje')}" onclick="tepkiVerProje(${proje.id}, 'like')">👍 <span>${proje.tepkiler.like}</span></button>
                <button class="tepki-emo-btn ${aktifEmoSinifi(proje.id, 'dislike', 'proje')}" onclick="tepkiVerProje(${proje.id}, 'dislike')">👎 <span>${proje.tepkiler.dislike}</span></button>
            </div>

            <div style="margin-top: 15px; text-align: right;">
                <button class="nav-btn-sari" style="font-size:12px; padding: 5px 12px;" onclick="yorumToggleProje(${proje.id})">
                    ${butonMetni}
                </button>
            </div>
            
            <div id="yorum-sekmesi-proje-${proje.id}" class="yorum-sekmesi" style="display:${displayStili};">
                <hr style="border:0; border-top:1px solid #222; margin:15px 0;">
                <div class="yorum-kaydirma-kutusu" id="proje-yorum-listesi-${proje.id}">${yorumlarHtml}</div>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <input type="text" id="proje-yorum-input-${proje.id}" class="meydan-input" style="margin-bottom:0; padding:8px;" placeholder="Projeye yorum bırak..." onkeydown="if(event.key === 'Enter') yorumYapProje(${proje.id})">
                    <button class="giris-btn" style="width:auto; padding:0 20px; border-radius:12px;" onclick="yorumYapProje(${proje.id})">Gönder</button>
                </div>
            </div>
        `;
        listeAlani.appendChild(kart);
    });

    if (aktifOdakID) {
        var inputElement = document.getElementById(`proje-yorum-input-${aktifOdakID}`);
        if (inputElement) inputElement.focus();
    }
}

function yorumToggleProje(id) {
    var idx = acikProjeler.indexOf(id);
    if (idx === -1) acikProjeler.push(id); else acikProjeler.splice(idx, 1);
    projeleriListele();
}

function yorumYapProje(projeId) {
    var input = document.getElementById(`proje-yorum-input-${projeId}`);
    if(!input) return;
    var icerik = input.value.trim();
    if(!icerik) return;

    var proje = projelerVeriTabani.find(p => p.id === projeId);
    if(proje) {
        proje.yorumlar.push({ yazar: kullaniciRumuz, icerik: icerik, tarihMetni: suAnkiZamaniGetir() });
        if(!acikProjeler.includes(projeId)) acikProjeler.push(projeId);
        projeleriListele(projeId);
        var k = document.getElementById(`proje-yorum-listesi-${projeId}`);
        if(k) k.scrollTop = k.scrollHeight;
    }
}

function hakkimdaDuzenle() {
    var p = document.getElementById('hakkimda-metni');
    var txt = document.getElementById('hakkimda-input');
    var btn = document.getElementById('hakkimda-btn');
    if(!p || !txt || !btn) return;

    if(txt.style.display === 'none') {
        p.style.display = 'none';
        txt.style.display = 'block';
        txt.focus();
        btn.innerText = "Kaydet";
    } else {
        kullaniciHakkimda = txt.value.trim() || "Meydanda yeni bir geliştirici...";
        p.innerText = kullaniciHakkimda;
        p.style.display = 'block';
        txt.style.display = 'none';
        btn.innerText = "Hakkımda Düzenle";
    }
}

function profilAkisiniYukle() {
    var akis = document.getElementById('profil-kendi-akisi');
    if(!akis) return;
    akis.innerHTML = '';

    var benimKonular = konularVeriTabani.filter(k => k.yazar === kullaniciRumuz);
    var benimProjeler = projelerVeriTabani.filter(p => p.yazar === kullaniciRumuz);

    if(benimKonular.length === 0 && benimProjeler.length === 0) {
        akis.innerHTML = `<div class="yorum-item" style="border-color:#444;"><p style="color:#666;">Henüz meydanda bir iz bırakmadın şef...</p></div>`;
        return;
    }

    benimKonular.forEach(k => {
        akis.innerHTML += `
            <div class="profil-akis-item">
                <span class="p-etiket-konu">KONU</span>
                <h4>${k.baslik}</h4>
                <p>${k.icerik.substring(0,60)}...</p>
            </div>
        `;
    });

    benimProjeler.forEach(p => {
        akis.innerHTML += `
            <div class="profil-akis-item">
                <span class="p-etiket-proje">PROJE</span>
                <h4>${p.adi} [${p.durum}]</h4>
                <p>${p.fikir.substring(0,60)}...</p>
            </div>
        `;
    });
}

function ortakAktiviteAkisiniBesle(tur, yazar, baslik, linkSekmesi, zamanDamgasi) {
    var kisaBaslik = baslik.length > 22 ? baslik.substring(0, 22) + "..." : baslik;
    ortakAktiviteAkisi.unshift({
        tür: tur,
        yazar: yazar,
        baslik: kisaBaslik,
        link: linkSekmesi,
        tarih: zamanDamgasi
    });
}

function aktiviteAkisiniGuncelle() {
    var akisAlani = document.getElementById('canli-aktivite-akisi');
    if(!akisAlani) return;
    akisAlani.innerHTML = '';

    ortakAktiviteAkisi.forEach(islem => {
        var item = document.createElement('div');
        item.className = 'aktivite-item';
        var tarihHtml = `<span class="aktivite-zaman">${islem.tarih}</span>`;

        if(islem.tür === 'konu') {
            item.innerHTML = `🟢 <span>${islem.yazar}</span> konu açtı: ${tarihHtml}<br> <b style="color:#fff; cursor:pointer;" onclick="sekmeDegistir('${islem.link}')">${islem.baslik} 🔥</b>`;
        } else {
            item.innerHTML = `🚀 <span style="color:#00ffcc;">${islem.yazar}</span> proje başlattı: ${tarihHtml}<br> <b style="color:#00ffcc; cursor:pointer;" onclick="sekmeDegistir('${islem.link}')">${islem.baslik} 🛠️</b>`;
        }
        akisAlani.appendChild(item);
    });
}

function lightboxAc(src) {
    var modal = document.getElementById("lightbox-modal");
    var img = document.getElementById("lightbox-img");
    if(modal && img) {
        modal.style.display = "flex";
        img.src = src;
    }
}
function lightboxKapat() {
    var modal = document.getElementById("lightbox-modal");
    if(modal) modal.style.display = "none";
}

function oyVer(evet, hayir, secim) {
    var alan = document.getElementById('anket-alani');
    if(!alan) return;
    alan.innerHTML = `
    <div class="yk-etiket">Günün Dopamin Anketi 📊</div>
    <h3>Bugün mülakata girsen elenmekten korkar mısın?</h3>
    <div class="sonuc-satiri"><span>Evet 😔 ${secim === 'g' ? '<b>(Senin Seçimin)</b>' : ''}</span><div class="bar-arkaplan"><div class="bar-doluluk" style="width:${evet}%"></div></div><span class="oran-yazi">%${evet}</span></div>
    <div class="sonuc-satiri" style="margin-top:10px;"><span>Hayır 😎 ${secim === 'r' ? '<b>(Senin Seçimin)</b>' : ''}</span><div class="bar-arkaplan"><div class="bar-doluluk" style="width:${hayir}%"></div></div><span class="oran-yazi">%${hayir}</span></div>`;
}
function oyVerMobbing(evet, hayir, secim){
    var alan = document.getElementById('anket-alani-2');
    if(!alan) return;
    alan.innerHTML = `
    <div class="yk-etiket">Günün Veri Anketi 📊</div>
    <h3>Çalıştığın yerde sana mobbing uygulanıyor mu?</h3>
    <div class="sonuc-satiri"><span>Evet 😔 ${secim === 'm' ? '<b>(Senin Seçimin)</b>' : ''}</span><div class="bar-arkaplan"><div class="bar-doluluk" style="width:${evet}%"></div></div><span class="oran-yazi">%${evet}</span></div>
    <div class="sonuc-satiri" style="margin-top:10px;"><span>Hayır 😎 ${secim === 'k' ? '<b>(Senin Seçimin)</b>' : ''}</span><div class="bar-arkaplan"><div class="bar-doluluk" style="width:${hayir}%"></div></div><span class="oran-yazi">%${hayir}</span></div>`;
}