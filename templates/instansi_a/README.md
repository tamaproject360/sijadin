# Template Instansi A

Template laporan perjalanan dinas untuk Instansi A.

## Files

- `template_v1.docx` - Template DOCX dengan placeholder docxtpl
- `schema_v1.json` - Schema struktur laporan

## Placeholder Variables (docxtpl)

### Metadata
- `{{ meta.activity_name }}` - Nama kegiatan
- `{{ meta.location }}` - Lokasi
- `{{ meta.date_start }}` - Tanggal mulai
- `{{ meta.date_end }}` - Tanggal selesai
- `{{ meta.unit }}` - Unit/instansi
- `{{ meta.participants }}` - Array peserta

### Sections
- `{{ pendahuluan.content }}` - Konten pendahuluan
- `{{ pelaksanaan.content }}` - Konten pelaksanaan
- `{{ hasil.content }}` - Konten hasil
- `{{ penutup.content }}` - Konten penutup

### Agenda Table
```
{% for row in pelaksanaan.subsections[0].table %}
{{ row.data.waktu }} | {{ row.data.kegiatan }} | {{ row.data.pembicara }}
{% endfor %}
```

### Photos
```
{% for photo in lampiran.attachments.photos %}
{{ photo.caption }}
{% endfor %}
```

## Usage

1. Upload template DOCX ke database via admin panel
2. Link dengan schema JSON
3. System akan menggunakan template ini untuk generate laporan
