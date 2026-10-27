import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# 1. Font Registration
font_dir = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("Malgun", os.path.join(font_dir, "malgun.ttf")))
pdfmetrics.registerFont(TTFont("MalgunBold", os.path.join(font_dir, "malgunbd.ttf")))

# 2. Canvas for Header/Footer & Page Numbers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header Bar
        self.setFillColor(colors.HexColor("#0F172A"))
        self.rect(0, 825, 595.27, 17, stroke=0, fill=1)
        
        self.setFillColor(colors.HexColor("#1D4ED8"))
        self.rect(0, 822, 595.27, 3, stroke=0, fill=1)

        # Header Text
        self.setFont("Malgun", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 808, "디지마인드(DigiMind) | 은둔고립청년 지원 플랫폼 연구 보고서")
        
        # Line below header
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 802, 559.27, 802)

        # Footer Line & Text
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 45, 559.27, 45)

        self.setFont("Malgun", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(36, 30, "캡스톤 디자인 졸업작품 학술 타당성 및 로드맵 문서")
        
        page_text = f"페이지 {self._pageNumber} / {page_count}"
        self.drawRightString(559.27, 30, page_text)
        
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Styles
    style_title = ParagraphStyle(
        'DocTitle',
        fontName='MalgunBold',
        fontSize=20,
        leading=26,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )

    style_subtitle = ParagraphStyle(
        'DocSubtitle',
        fontName='Malgun',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#2563EB"),
        spaceAfter=14
    )

    style_section_h1 = ParagraphStyle(
        'SectionH1',
        fontName='MalgunBold',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=8
    )

    style_body = ParagraphStyle(
        'BodyTextCustom',
        fontName='Malgun',
        fontSize=9.5,
        leading=14.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4
    )

    style_todo_item = ParagraphStyle(
        'TodoItem',
        fontName='Malgun',
        fontSize=9.5,
        leading=14.5,
        textColor=colors.HexColor("#1E293B")
    )

    story = []

    # --- Document Header Title ---
    story.append(Spacer(1, 4))
    story.append(Paragraph("디지마인드(DigiMind) 핵심 기능 학술 근거 & 향후 계획", style_title))
    story.append(Paragraph("은둔·고립 청년 지원 핵심 기능의 학술적 타당성 및 연구·개발 추진 과제", style_subtitle))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1D4ED8"), spaceAfter=12))

    # --- Section: TODO LIST ---
    story.append(Paragraph("📋 앞으로 해야 할 일 (추진 과제 및 연구 로드맵)", style_section_h1))

    todos = [
        ("1. 협력 가능성 및 플랜 B 검토", "민간단체나 국가/지자체 단체와 협력 가능성을 알아보고, 아닐 경우 플랜 B 수립하기"),
        ("2. 학술 논문 작성 준비", "개발 배경, 시스템 설계, 고립 청년 심리 회복 서포트 메커니즘을 바탕으로 논문 작성 준비하기"),
        ("3. 데이터베이스(DB) 연결 논의", "사용자 이력, 루틴 데이터 및 커뮤니티 데이터의 지속성을 위한 DB 연결 필요성에 대해 지도교수님과 논의하기"),
        ("4. 학술 실증 근거 수집", "은둔고립 청년 관련 최신 논문, 실태조사 통계 및 뇌과학/심리학 이론 근거 수집 및 체계화하기")
    ]

    todo_table_data = []
    for title, desc in todos:
        p_title = Paragraph(f"<b>{title}</b>", style_todo_item)
        p_desc = Paragraph(desc, style_body)
        todo_table_data.append([p_title, p_desc])

    todo_table = Table(todo_table_data, colWidths=[150, 365])
    todo_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor("#0F172A")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))

    story.append(todo_table)
    story.append(Spacer(1, 14))

    # --- Section: Feature 1 ---
    f1_header = Paragraph("🎮 [기능 1] 나의 디지몬 & 단계별 퀘스트 (Micro-Routine & Evolution)", style_section_h1)
    
    f1_papers = Paragraph(
        "<b>📚 관련 학술 논문 및 정부 보고서 근거</b><br/>"
        "• <b>한국보건사회연구원 (2022)</b> - 『고립·은둔 청년 지원사업 모형 개발 연구』<br/>"
        "• <b>서울특별시 / 보건복지부 (2023)</b> - 『전국 고립·은둔 청년 실태조사 보고서』<br/>"
        "• <b>행동활성화 치료 이론 (Behavioral Activation Theory, BA)</b>",
        style_body
    )

    f1_rationale = Paragraph(
        "<b>💡 왜 이 기능이 필요한가? (학술적 타당성)</b><br/>"
        "<b>1) 무기력감 극복을 위한 단계별 '행동 활성화(Micro-Routine)':</b><br/>"
        "서울시 실태조사 결과 고립·은둔 청년의 <b>75.4%가 극심한 무기력감과 자기통제력 상실</b>을 호소합니다. 심리학의 '행동활성화 치료(BA)' 이론에 따라 <b>1단계(2분 산책, 기지개)부터 2단계(이불개기), 3단계(러닝), 4단계(마트/도서관), 5단계(자립/운동)로 올 클리어 시 퀘스트가 점진적으로 업그레이드</b>되어 우울감을 획기적으로 낮춥니다.<br/>"
        "<b>2) 자기효능감(Self-Efficacy) 및 단계별 레벨 업 피드백:</b><br/>"
        "오늘의 루틴 올 클리어 시 성취 보너스 EXP 지급과 함께 파트너 디지몬이 성장하고 레벨업하는 시각적 피드백은 청년 스스로 <i>\"나도 해낼 수 있다\"</i>는 강력한 자기효능감을 회복시켜 줍니다.",
        style_body
    )

    card1_data = [[f1_papers], [HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=4)], [f1_rationale]]
    card1_table = Table(card1_data, colWidths=[515])
    card1_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(KeepTogether([f1_header, card1_table]))
    story.append(Spacer(1, 14))

    # --- Section: Feature 2 ---
    f2_header = Paragraph("💬 [기능 2] 안심 온기 커뮤니티 & 매너온도 (Safe Peer Support & Security)", style_section_h1)

    f2_papers = Paragraph(
        "<b>📚 관련 학술 논문 및 정부 보고서 근거</b><br/>"
        "• <b>Archives of Design Research (2024)</b> - 『고립 청년의 사회적 관계망 형성을 위한 서비스 방향성 연구』<br/>"
        "• <b>동료 지지 이론 (Peer Support Theory)</b> 및 <b>심리적 안전지대 (Psychological Safety Zone)</b> 개념",
        style_body
    )

    f2_rationale = Paragraph(
        "<b>💡 왜 이 기능이 필요한가? (학술적 타당성)</b><br/>"
        "<b>1) 수평적 동료 지지(Peer Support)의 효과:</b><br/>"
        "은둔 청년들은 부모나 전문가의 수직적 지시나 오프라인 대면 접근에 강한 반발심과 두려움을 느낍니다. 학술 연구에 따르면, <b>유사한 상처와 경험을 가진 동료 청년 간 수평적 소통(Peer Support)</b>과 익명성이 보장된 비대면 공간에서 가장 높은 심리적 안정을 느낍니다.<br/>"
        "<b>2) 악용 방지 및 다각화 보안 (1:1 비밀제보 & 24h 핫라인):</b><br/>"
        "고립 청년은 타인의 비하나 악플에 매우 취약합니다. 클린 언어 자동 차단, 3회 누적 블라인드, <b>1:1 비밀 제보센터 및 24시간 위기 핫라인(109)</b>은 청년들이 상처받지 않는 <b>'심리적 안심 안전지대'</b>를 제공하는 필수 보안 장치입니다.",
        style_body
    )

    card2_data = [[f2_papers], [HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=4)], [f2_rationale]]
    card2_table = Table(card2_data, colWidths=[515])
    card2_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BBF7D0")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(KeepTogether([f2_header, card2_table]))
    story.append(Spacer(1, 14))

    # --- Section: Feature 3 ---
    f3_header = Paragraph("🤝 [기능 3] 세상으로 한걸음 더 나아가기 & 실전에서 동료만나기 (Micro Work & Support Network)", style_section_h1)

    f3_papers = Paragraph(
        "<b>📚 관련 학술 논문 및 실태조사 보고서 근거</b><br/>"
        "• <b>한국보건사회연구원 (2023)</b> - 『은둔형 외톨이 민간·지자체 지원 네트워크 연계 방안』<br/>"
        "• <b>두더지땅굴 / 서울시 고립청년 전담센터 (2023~2024)</b> - 『단계별 사회재진입(Micro Work) 일자리 모델 가이드』<br/>"
        "• <b>단계적 과제 제시 이론 (Graded Task Assignment)</b> 및 <b>감각 자극 세분화 모델 (Sensory Load Categorization)</b>",
        style_body
    )

    f3_rationale = Paragraph(
        "<b>💡 왜 이 기능이 필요한가? (학술적 타당성)</b><br/>"
        "<b>1) 사회 재진입을 돕는 단계별 5대 도전 미션 (Micro-stepping stone Work):</b><br/>"
        "은둔 청년이 갑작스러운 8시간 전일제 노동 환경에 노출되면 실패 경험과 함께 재은둔 위험이 급증합니다. '1. 집근처 배달알바', '2. 단기 택배알바', '3. 50L 쓰레기버리기', '4. 카페 사람구경', '5. 전문단체 연락' 등 <b>단계별 5대 도전 미션</b>은 사회재진입을 돕는 유연한 디딤돌 역할을 합니다.<br/>"
        "<b>2) 심리적 안전망 구축 (위약금 0원 보장 및 동반 출근 멘토):</b><br/>"
        "\"당일 컨디션 저하 시 위약금/불이익 0원(Zero-penalty guarantee)\" 및 \"요청 시 동반 출근 멘토 지원\"을 통해 청년이 느끼는 실수와 책임에 대한 두려움을 완화합니다.<br/>"
        "<b>3) 민간·국가 전문 지원기관 촘촘한 연계:</b><br/>"
        "'두더지땅굴', '청년도전지원사업', '서울시 고립청년 전담센터' 등 은둔고립 청년 전문 기관과 1:1 상담 연결을 통합 제공하여 촘촘한 사회적 안전망을 연계합니다.",
        style_body
    )

    card3_data = [[f3_papers], [HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=4)], [f3_rationale]]
    card3_table = Table(card3_data, colWidths=[515])
    card3_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#FDE68A")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(KeepTogether([f3_header, card3_table]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_pdf = "c:/Users/82108/OneDrive/바탕 화면/졸업작품/디지마인드_학술근거_및_향후계획.pdf"
    build_pdf(out_pdf)

