"""
Proposal Generator Service

AI-powered proposal writer that generates compliant, professional sections
and orchestrates full proposal assembly from opportunity requirements.
"""

try:
    from services.llm import llm_chat
except ImportError:
    from backend.services.llm import llm_chat


PROPOSAL_SECTIONS = [
    "Executive Summary",
    "Technical Approach",
    "Management Plan",
    "Past Performance",
    "Staffing Plan",
    "Quality Assurance",
    "Risk Management",
    "Transition Plan",
    "Cost/Price Narrative",
]


def generate_section(
    section_name: str,
    requirements: list[dict],
    opportunity: dict,
    company_profile: dict = None
) -> str:
    """Generate a single proposal section addressing specific requirements."""

    req_text = ""
    if requirements:
        req_text = "\n".join([
            f"- [{r.get('section_ref', 'N/A')}] {r.get('requirement', '')}"
            for r in requirements[:20]
        ])
    else:
        req_text = "(No specific requirements extracted for this section)"

    company_text = ""
    if company_profile:
        company_text = f"""
COMPANY PROFILE:
Name: {company_profile.get('name', 'Your Company')}
Capabilities: {company_profile.get('capabilities', 'Full-service contractor')}
Past Performance: {company_profile.get('past_performance', 'Relevant experience available')}
NAICS Codes: {company_profile.get('naics_codes', 'N/A')}
Certifications: {company_profile.get('certifications', 'N/A')}
"""

    prompt = f"""You are a professional government proposal writer with 15+ years of experience winning federal contracts.

Write a compelling, compliant proposal section.

OPPORTUNITY CONTEXT:
Title: {opportunity.get('title', 'Untitled')}
Agency: {opportunity.get('agency', 'Federal Agency')}
NAICS: {opportunity.get('naics', 'N/A')}
Type: {opportunity.get('type', 'Solicitation')}

{company_text}

SECTION TO WRITE: {section_name}

REQUIREMENTS TO ADDRESS:
{req_text}

WRITING GUIDELINES:
1. Address EVERY requirement explicitly (reference section numbers)
2. Use active voice and confident language
3. Be specific with metrics, timelines, and deliverables
4. Follow government proposal best practices:
   - Clear headings and structure
   - Compliance matrix style (Requirement -> Approach -> Benefit)
   - Emphasize understanding of agency mission
5. Professional tone, no marketing fluff
6. 400-600 words unless section requires more detail
7. Use markdown formatting (## for headings, bullets, bold)

OUTPUT:
## {section_name}
[Your compliant, professional response]

### Compliance Summary
[Brief list showing requirement coverage]"""

    try:
        content = llm_chat(
            "You are an expert government proposal writer specializing in federal contracting.",
            prompt
        )
        return content
    except Exception as e:
        print(f"Proposal generation error: {e}")
        return f"## {section_name}\n\n*Error generating section. Please try again or write manually.*"


def generate_executive_summary(
    opportunity: dict,
    company_profile: dict = None,
    win_themes: list[str] = None
) -> str:
    """Generate a targeted executive summary with win themes."""

    themes_text = ""
    if win_themes:
        themes_text = "WIN THEMES TO EMPHASIZE:\n" + "\n".join(f"- {t}" for t in win_themes)

    prompt = f"""Write a compelling Executive Summary for a government proposal.

OPPORTUNITY:
Title: {opportunity.get('title', 'Untitled')}
Agency: {opportunity.get('agency', 'Federal Agency')}
NAICS: {opportunity.get('naics', 'N/A')}
Value: {opportunity.get('value', 'N/A')}
Description: {opportunity.get('description', '')[:500]}

COMPANY: {(company_profile or {}).get('name', 'Our Company')}
Capabilities: {(company_profile or {}).get('capabilities', 'Full-service contractor')}

{themes_text}

The executive summary should:
1. Open with a clear understanding of the agency's mission and need
2. State our solution and key differentiators
3. Highlight relevant experience and past performance
4. Emphasize win themes throughout
5. Close with a confident statement of readiness
6. Be 400-600 words
7. Use markdown formatting"""

    try:
        return llm_chat(
            "You are a senior capture manager writing a winning executive summary.",
            prompt
        )
    except Exception as e:
        return f"## Executive Summary\n\n*Error generating executive summary: {e}*"


def generate_full_proposal(
    opportunity: dict,
    requirements: list[dict] = None,
    company_profile: dict = None,
    sections: list[str] = None,
    win_themes: list[str] = None
) -> dict:
    """
    Orchestrate generation of a complete multi-section proposal.

    Returns dict with 'sections' list and 'metadata'.
    """

    target_sections = sections or PROPOSAL_SECTIONS
    all_requirements = requirements or []

    generated_sections = []
    errors = []

    for section_name in target_sections:
        section_reqs = [
            r for r in all_requirements
            if section_name.lower() in (r.get('section', '') or '').lower()
            or section_name.lower() in (r.get('section_ref', '') or '').lower()
        ]

        if not section_reqs:
            section_reqs = all_requirements[:5]

        try:
            if section_name == "Executive Summary":
                content = generate_executive_summary(
                    opportunity, company_profile, win_themes
                )
            else:
                content = generate_section(
                    section_name, section_reqs, opportunity, company_profile
                )

            generated_sections.append({
                "name": section_name,
                "content": content,
                "requirements_addressed": len(section_reqs),
                "status": "generated",
            })
        except Exception as e:
            errors.append({"section": section_name, "error": str(e)})
            generated_sections.append({
                "name": section_name,
                "content": f"## {section_name}\n\n*Generation failed. Please write manually.*",
                "requirements_addressed": 0,
                "status": "error",
            })

    compliance_coverage = sum(
        s["requirements_addressed"] for s in generated_sections
    )

    return {
        "sections": generated_sections,
        "metadata": {
            "opportunity_title": opportunity.get("title", "Untitled"),
            "agency": opportunity.get("agency", "Unknown"),
            "total_sections": len(generated_sections),
            "successful_sections": len([s for s in generated_sections if s["status"] == "generated"]),
            "total_requirements": len(all_requirements),
            "requirements_covered": compliance_coverage,
            "errors": errors,
        },
    }


def generate_compliance_matrix(
    requirements: list[dict],
    opportunity: dict,
    company_profile: dict = None
) -> str:
    """Generate a compliance matrix mapping requirements to responses."""

    if not requirements:
        return "## Compliance Matrix\n\nNo requirements extracted for matrix generation."

    req_rows = "\n".join([
        f"| {r.get('section_ref', 'N/A')} | {r.get('requirement', '')[:80]} | Compliant | See Section X |"
        for r in requirements[:30]
    ])

    prompt = f"""Create a detailed compliance matrix for a government proposal.

OPPORTUNITY: {opportunity.get('title', 'Untitled')}
AGENCY: {opportunity.get('agency', 'Federal Agency')}

Fill in the compliance matrix with specific responses showing how we meet each requirement.

| Ref | Requirement | Status | Response Location |
|-----|-------------|--------|-------------------|
{req_rows}

For each requirement:
1. Confirm compliance status (Compliant / Partial / Exception)
2. Reference the proposal section where it's addressed
3. Add a brief compliance note

Output the completed matrix in markdown table format."""

    try:
        return llm_chat(
            "You are a compliance specialist creating a proposal compliance matrix.",
            prompt
        )
    except Exception as e:
        return f"## Compliance Matrix\n\n*Error generating matrix: {e}*"


def generate_win_themes(
    opportunity: dict,
    company_profile: dict = None
) -> list[str]:
    """Generate win themes for a specific opportunity."""

    prompt = f"""Analyze this government contract opportunity and generate 4-6 compelling win themes.

OPPORTUNITY:
Title: {opportunity.get('title', 'Untitled')}
Agency: {opportunity.get('agency', 'Federal Agency')}
Description: {opportunity.get('description', '')[:500]}
NAICS: {opportunity.get('naics', 'N/A')}

COMPANY: {(company_profile or {}).get('name', 'Our Company')}
Capabilities: {(company_profile or {}).get('capabilities', 'Full-service contractor')}

Win themes should:
1. Align with the agency's mission and stated needs
2. Differentiate us from competitors
3. Be specific and measurable where possible
4. Address evaluation criteria

Return ONLY a JSON array of strings, each being a win theme. Example:
["Theme 1", "Theme 2", "Theme 3"]"""

    try:
        result = llm_chat(
            "You are a capture management expert identifying winning themes.",
            prompt
        )
        import json
        start = result.find('[')
        end = result.rfind(']') + 1
        if start >= 0 and end > start:
            return json.loads(result[start:end])
        return [line.strip('- "') for line in result.strip().split('\n') if line.strip()]
    except Exception as e:
        return [
            "Deep understanding of agency mission and requirements",
            "Proven track record with similar federal programs",
            "Technical innovation reducing cost and risk",
            "Strong management approach ensuring on-time delivery",
        ]
