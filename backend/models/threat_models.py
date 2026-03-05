from pydantic import BaseModel, Field, ConfigDict
from typing import List, Literal

class ThreatActor(BaseModel):
    id: str
    name: str
    category: Literal['Ransomware', 'Stealer', 'Initial Access Broker', 'APT', 'Botnet', 'Cryptominer']
    status: Literal['Active', 'Inactive', 'Emerging']
    description: str
    profileImage: str
    targetedCountries: List[str]
    associatedMalware: List[str]
    lastUpdated: str

    model_config = ConfigDict(populate_by_name=True)

class MalwareFamily(BaseModel):
    id: str
    name: str
    type: str
    description: str

    model_config = ConfigDict(populate_by_name=True)

class CVE(BaseModel):
    id: str
    cveId: str
    title: str
    severity: Literal['Critical', 'High', 'Medium', 'Low']

    model_config = ConfigDict(populate_by_name=True)

class IOC(BaseModel):
    id: str
    value: str
    type: Literal['IP', 'Domain', 'Hash', 'URL']
    firstSeen: str
    lastSeen: str

    model_config = ConfigDict(populate_by_name=True)
