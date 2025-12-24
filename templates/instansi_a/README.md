# Template Instansi A

Template untuk laporan perjalanan dinas Instansi A.

## Files

- `template_v1.docx` - Template DOCX dengan placeholder docxtpl
- `schema_v1.json` - Schema struktur laporan (section wajib, metadata, dll)

## Placeholder docxtpl

Template DOCX menggunakan Jinja2 syntax untuk placeholder:

### Metadata
- `{{ meta.activity_name }}` - Nama kegiatan
- `{{ meta.location }}` - Lokasi
- `{{ meta.date_start }}` - Tanggal mulai
- `{{ meta.date_end }}` - Tanggal selesai
- `{{ meta.unit }}` - Unit/Bagian

### Sections
- `{{ sections.pendahuluan.content }}` - Konten pendahuluan
- `{{ sections.dasar_pelaksanaan.content }}` - Dasar pelaksanaan
- `{{ sections.hasil.content }}` - Hasil dan pembahasan
- `{{ sections.kesimpulan.content }}` - Kesimpulan

### Loops

#### Peserta
```
{% for peserta in sections.pelaksanaan.subsections.peserta.items %}
- {{ peserta }}
{% endfor %}
```

#### Agenda
```
{% for row in sections.pelaksanaan.subsections.agenda.table %}
| {{ row.waktu }} | {{ row.kegiatan }} | {{ row.keterangan }} |
{% endfor %}
```

#### Foto Lampiran
```
{% for photo in sections.lampiran.attachments.photos %}
{{ photo.image }}
Caption: {{ photo.caption }}
{% endfor %}
```

## Notes

- Template DOCX harus dibuat manual menggunakan Microsoft Word atau LibreOffice
- Gunakan docxtpl syntax untuk placeholder
- Schema JSON mendefinisikan struktur yang wajib ada
