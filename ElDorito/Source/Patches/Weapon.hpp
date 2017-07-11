#pragma once
#include <string>
#include <vector>

#include "../Modules/ModuleWeapon.hpp"
#include "../Blam/Math/RealVector3D.hpp"

namespace Patches
{
	namespace Weapon
	{
		void ApplyAll();
		void ApplyAfterTagsLoaded();

		std::map<std::string, uint16_t> GetIndices();
		uint16_t GetIndex(std::string &weaponName);
		std::string GetName(uint16_t &weaponIndex);
		uint16_t GetEquippedWeaponIndex();
		std::string GetEquippedWeaponName();
		Blam::Math::RealVector3D GetOffsetByIndex(uint16_t &weaponIndex);
		Blam::Math::RealVector3D GetOffsetByName(std::string &weaponName);

		void SetOffsetModified(std::string &weaponName, Blam::Math::RealVector3D &weaponOffset);

		void ApplyOffset(std::string &weaponName, Blam::Math::RealVector3D &weaponOffset);

		bool IsOffsetModified(const std::string &weapon);

		namespace Config
		{
			void Load(std::string configPath);
			void Save(std::string configPath);
		}
	}
}